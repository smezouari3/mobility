import { Rating } from './../../../model/rating';
import { RatingService } from './../../../service/rating.service';
import { CityService } from './../../../service/city.service';
import { City } from './../../../model/city';
import { VehicleTypeService } from './../../../service/vehicle-type.service';
import { DriverService } from './../../../service/driver.service';
import { VehicleType } from './../../../model/vehicleType';
import { Driver } from './../../../model/driver';
import { BookingService } from './../../../service/booking.service';
import { Booking } from './../../../model/booking';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';
import { UserService } from 'src/app/service/user.service';
import { USE_STORE } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.scss']
})
export class ProfilUserComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  id:number=0;
  user: User=new User();
  authUser:User;
  customer:User=new User();
  driver:Driver=new Driver();
  drivr:Driver=new Driver();
  cities:City[]=[];
  vehicleType:VehicleType=null;
  roleSelected;
  public host = environment.apiUrl;
  currenUserName='';
  email='';

  bookingShow:Booking[]=[];
  bookings:Booking[]=[];
  filtredBooking:Booking[];
  fromAdress:any;
  toAdress:any;
  data=[];
  filtredData=[];
  ratings:Rating[]=[];
  dataRating=[];

  rat:number=0;
  countRat:number=0;



  public roles=[
    {key:"ROLE_SUPER_ADMIN",value:"SUPER ADMIN"},
    {key:"ROLE_ADMIN",value:"ADMIN"},
    {key:"ROLE_MANAGER",value:"MANAGER"},
    {key:"ROLE_DRIVER",value:"DRIVER"},
    {key:"ROLE_USER",value:"USER"},
    {key:"ROLE_HR",value:"HR"},
  ];

  // private subscriptions: Subscription[] = [];

  // public validate = false;
  // public selectedRole:String='';
  // public fileStatus = new FileUploadStatus();
  // private currentUsername: string;
  // private email: string;
  // public profileImage: File;
  // public pass:string;
  // public newPass:string;
  // show:boolean=false;
  // showPass:boolean=false;

  // // public profileImage: File;


  // title = 'ngImageCrop';
  // imageChangedEvent: any = '';
  // croppedImage: any = '';
  // bookings:Booking[]=[];


  // public url: any;

  // filtredBooking:Booking[];
  // selectedBookings:Booking[];
  // authUser:User;
  // loading: boolean = true;
  // fromAdress:any;
  // toAdress:any;
  // data=[];
  // filtredData=[];
  // driver:Driver;
  // vehicleType:VehicleType=null;



  constructor(private route: ActivatedRoute, private authenticationService:AuthenticationService,private ratingService:RatingService ,private cityService:CityService, private driverService:DriverService, private vehicleTypeService:VehicleTypeService, private bookingService:BookingService, private modalService: NgbModal, private userService:UserService, private router:Router, private notificationService:NotificationsService) {
    if(this.authenticationService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authenticationService.getUserFromLocalCache();
      if(this.authUser.role=="ROLE_USER" || this.authUser.role=="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }else{
        this.route.paramMap.subscribe( params => {
          this.id = parseInt(params.get('id'));
        });
      }
    }
  }

  async ngOnInit(){
    if(this.id>0){

      const res1:any= await this.userService.userGet(this.id).toPromise();
      this.user=res1;
      console.log(this.user);
      if(this.user!=null){
        this.currenUserName=this.user.username;
        this.email=this.user.email;
        console.log(this.user);
        this.driver=new Driver();
        if(this.user.driver!=null){
          this.driver=this.user.driver;
          const resx:any=await this.cityService.getRecords().toPromise();
          this.cities=resx;

          const res2:any =await this.bookingService.getBookings().toPromise();
          this.bookings=res2;
          for(let booking of this.bookings){
            if(booking.status!="En attente"){
              if(booking.driver_id==this.user.driver.id){
                console.log("im in if");
                this.bookingShow.push(booking);
              }
            }
          }
          this.filtredBooking=this.bookingShow;

          const res3:any =await this.ratingService.getDrivers().toPromise();
          this.ratings=res3;

          for(let rating of this.ratings){
            if(rating.driverId==this.user.driver.id){
              this.rat=this.rat+rating.rating;
              this.countRat++;
              const res:any=await this.userService.userGet(this.bookings.find(bk=>bk.id==rating.bookingId).customerId).toPromise();
              let obj={"rating":rating,"booking":this.bookings.find(bk=>bk.id==rating.bookingId),"user":res};
              this.dataRating.push(obj);

            }
          }

          await this.getData1();
        }else{
          const ress2:any =await this.bookingService.getBookingWithCustomer(this.user.id).toPromise();
          this.bookings=ress2;
          this.filtredBooking=this.bookings;


          await this.getData2();
        }
      }else{
        console.log("im in else");
        this.router.navigateByUrl('/error404');
      }
    }else{
      this.router.navigateByUrl('/error404');
    }


    console.log(this.filtredData);

    // this.driver=new Driver();
    // this.driver.userInfo=new User();
    // this.user=this.authenticationService.getUserFromLocalCache();
    // const res:any=await this.userService.userGet(this.user.id).toPromise();
    // this.user=res;

    // console.log(this.user);

    // const res2:any =await this.bookingService.getBookingWithCustomer(this.user.id).toPromise();
    // this.bookings=res2;
    // this.filtredBooking=this.bookings;


    // await this.getData();

    // this.currentUsername=this.user.username;
    // this.email=this.user.email;
    // console.log(this.user);
  }
  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    useBothWheelAxes : false
  };
  async getData2(){
    this.data=[];
    for(let booking of this.filtredBooking){
      await this.getFromAddress(+booking.fromLatitude,+booking.fromLongitude);
      await this.getToAddress(+booking.toLatitude,+booking.toLongitude);
      this.drivr=new Driver();
      this.drivr.userInfo=new User();
      if(booking.driver_id){
        const res2:any= await this.driverService.getDriver(booking.driver_id).toPromise();
        this.drivr=res2;
      }
      if(booking.vehicle_type_id){
        const res3:any= await this.vehicleTypeService.getRecordWithId(booking.vehicle_type_id).toPromise();
        this.vehicleType=res3;
      }else{
        this.vehicleType=new VehicleType();
      }

      let obj={"booking":booking,"driver":this.drivr,"vehicleType":this.vehicleType,"from_adress":this.fromAdress,"to_adress":this.toAdress};
      this.data.push(obj);

    }
    this.filtredData=this.data;
    console.log(this.filtredData.length);
  }

  async getData1(){
    this.data=[];
    for(let booking of this.filtredBooking){
      await this.getFromAddress(+booking.fromLatitude,+booking.fromLongitude);
      await this.getToAddress(+booking.toLatitude,+booking.toLongitude);
      if(booking.driver_id){
        const res2:any= await this.userService.userGet(booking.customerId).toPromise();
        this.customer=res2;
      }
      if(booking.vehicle_type_id){
        const res3:any= await this.vehicleTypeService.getRecordWithId(booking.vehicle_type_id).toPromise();
        this.vehicleType=res3;
      }else{
        this.vehicleType=new VehicleType();
      }
      let obj={"booking":booking,"customer":this.customer,"vehicleType":this.vehicleType,"from_adress":this.fromAdress,"to_adress":this.toAdress};
      this.data.push(obj);

    }
    this.filtredData=this.data;
    console.log(this.filtredData.length);
  }
  getFromAddress( lat: number, lng: number) {
    return new Promise(resolve=>{
      let ville="";
      if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { location: latlng };
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            let result = results[0];
            this.fromAdress=result.formatted_address;
          }
          resolve(this.fromAdress);
        });
      }
    });
  }

  getToAddress( lat: number, lng: number) {
    return new Promise(resolve=>{
      let ville="";
      if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { location: latlng };
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            let result = results[0];
            this.toAdress=result.formatted_address;
          }
          resolve(this.toAdress);
        });
      }
    });
  }
  public reset(){
    this.subscriptions.push(
      this.userService.resetPassword(this.email).subscribe(
        (response: CustomHttpRespone) => {
          console.log(response);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:response.message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+error.error.message+'</b>',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
    );
  }
  public submit(){
    console.log(this.user);
    console.log(this.currenUserName);
    console.log(this.driver);
    const formData = new FormData();

    formData.append('currentUsername', this.currenUserName);
    formData.append('firstName', this.user.firstName);
    formData.append('lastName', this.user.lastName);
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('role', this.user.role);
    formData.append('verified', JSON.stringify(this.user.verified));
    formData.append('isActive', JSON.stringify(this.user.isActive));
    formData.append('isNonLocked', JSON.stringify(this.user.isNotLocked));

    this.subscriptions.push(
      this.userService.updateUserV2(formData).subscribe(
        (response: User) => {
          console.log("success");
          console.log(response);
          this.currenUserName=this.user.username;
          this.email=this.user.email;
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:"Modifier avec succès",
            showConfirmButton: false,
            timer: 2000
          });
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("error");
          console.log(errorResponse);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+errorResponse.error.message+'</b>',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
    );
    if(this.driver.id!=0){
      this.driver.city_id=+this.driver.city_id;

      this.subscriptions.push(
        this.driverService.updatRecord(this.driver).subscribe(
          (response: CustomHttpRespone) => {
            console.log("success");
            console.log(response);
            Swal.fire({
              position: 'top-end',
              width: 300,
              title: '<strong translate="">Succes</strong>',
              icon: 'success',
              html:"Modifier avec succès",
              showConfirmButton: false,
              timer: 2000
            });
          },
          (errorResponse: HttpErrorResponse) => {
            console.log("error");
            console.log(errorResponse);
            Swal.fire({
              position: 'top-end',
              width: 300,
              title: '<strong translate="">Erreur</strong>',
              icon: 'error',
              html:
                '<b>'+errorResponse.error.message+'</b>',
              showConfirmButton: false,
              timer: 2000
            });
          }
        )
      );
    }
  }

  public deleteRecord() {
    swalWithBootstrapButtons.fire({
      title: 'Supprimer',
      text: "Vous ne pourrez pas récupérer les données d'utilisateur!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, Supprimer!',
      cancelButtonText: 'Non, Annuler!',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.subscriptions.push(
          this.userService.deleteUser(this.user.username).subscribe(
            (response: CustomHttpRespone)=>{
              swalWithBootstrapButtons.fire(
                'Supprimer!',
                "L'utilisateur est supprimer.",
                'success'
              );
              setTimeout(()=>{
                this.router.navigateByUrl("/dashboard/user");
              },2500);
            }
          )
        )

      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Annuler',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });
  }


}
