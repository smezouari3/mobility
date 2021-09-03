import { Rating } from './../../model/rating';
import { RatingService } from './../../service/rating.service';
import { VehicleTypeService } from './../../service/vehicle-type.service';
import { DriverService } from './../../service/driver.service';
import { VehicleType } from './../../model/vehicleType';
import { Driver } from './../../model/driver';
import { BookingService } from './../../service/booking.service';
import { Booking } from './../../model/booking';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { FileUploadStatus } from './../../model/file-upload.status';
import { HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-driver-profil',
  templateUrl: './driver-profil.component.html',
  styleUrls: ['./driver-profil.component.scss']
})
export class DriverProfilComponent implements OnInit {
  user: User;
  private subscriptions: Subscription[] = [];

  public validate = false;
  public selectedRole:String='';
  public fileStatus = new FileUploadStatus();
  private currentUsername: string;
  private email: string;
  public profileImage: File;
  public pass:string;
  public newPass:string;
  show:boolean=false;
  showPass:boolean=false;

  // public profileImage: File;


  title = 'ngImageCrop';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  bookings:Booking[]=[];


  public url: any;

  public host = "http://localhost:8081";
  filtredBooking:Booking[];
  selectedBookings:Booking[];
  loading: boolean = true;
  fromAdress:any;
  toAdress:any;
  data=[];
  filtredData=[];
  driver:Driver;
  customer:User;
  vehicleType:VehicleType=null;
  bookingShow:Booking[]=[];
  ratings:Rating[]=[];
  dataRating=[];
  rat:number=0;
  countRat:number=0;
  authUser:User;



  constructor(private authenticationService:AuthenticationService,private ratingService:RatingService, private driverService:DriverService, private vehicleTypeService:VehicleTypeService, private bookingService:BookingService, private modalService: NgbModal, private userService:UserService, private router:Router, private notificationService:NotificationsService) {

    if(this.authenticationService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authenticationService.getUserFromLocalCache();
      if(this.authUser.role!="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }
    }
   }

  async ngOnInit(){
    this.driver=new Driver();
    this.customer=new User();
    this.user=this.authenticationService.getUserFromLocalCache();
    const res:any=await this.userService.userGet(this.user.id).toPromise();
    this.user=res;
    this.driver=this.user.driver;


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
    await this.getData();

    this.currentUsername=this.user.username;
    this.email=this.user.email;
  }

  async getData(){
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



  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    useBothWheelAxes : false
  };

  showPassword() {
    this.showPass = !this.showPass;
  }

  public submit() {
    if(this.user.firstName.trim()=="" || this.user.lastName.trim()=="" || this.user.email.trim()=="" || this.user.phone.trim()==""){
      Swal.fire({
        position: 'top-end',
        width: 300,
        title: '<strong translate="">Erreur</strong>',
        icon: 'error',
        html:
          '<b>Tous les champs obligatoires</b>',
        showConfirmButton: false,
        timer: 2000
      });
    }else{
      const formData = this.userService.createUserFormDate(this.currentUsername, this.user, this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
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


  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }


  fileChangeEvent(event: any): void {
    this.show=true;
    // this.profileImage=event.target.files[0];
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(this.croppedImage);
  }
  imageLoaded() {
      /* show cropper */
      this.show=true;
  }
  cropperReady() {
      /* cropper ready */
  }
  loadImageFailed() {
    this.show=false;
    this.notificationService.error('Failed','Failed to load image',{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  public onUpdateProfileImage(): void {
    if(this.croppedImage){
      const fileToUpload: File = new File([this.dataURItoBlob(this.croppedImage)], this.user.username+'.png');
      const formData = new FormData();
      formData.append('username', this.user.username);
      formData.append('profileImage', fileToUpload);
      this.subscriptions.push(
        this.userService.updateProfileImage(formData).subscribe(
          (event: HttpEvent<any>) => {
            console.log("success");
            console.log(event);
            Swal.fire({
              position: 'top-end',
              width: 300,
              title: '<strong translate="">Succes</strong>',
              icon: 'success',
              html:"Photo modifier",
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
            this.fileStatus.status = 'done';
          }
        )
      );
    }else{
      this.notificationService.error('error','this is not an image',{
        position:['top','right'],
        timeOut:2000,
        animate:'fade',
        showProgressBar:true,
        clickToClose: false,
        clickIconToClose: true
      });
    }
  }

  public onRsetPassword(){
    if(this.pass.trim()=="" || this.newPass.trim()==""){
      Swal.fire({
        position: 'top-end',
        width: 300,
        title: '<strong translate="">Erreur</strong>',
        icon: 'error',
        html:
          '<b>les champs du mot de passe obligatoires</b>',
        showConfirmButton: false,
        timer: 2000
      });
    }else{
      const formData = new FormData();
      formData.append('userName', this.user.username);
      formData.append('currentPassword', this.pass);
      formData.append('newPassword', this.newPass);
      this.subscriptions.push(
        this.userService.resetUserPassword(formData).subscribe(
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
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

   open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.onUpdateProfileImage();
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
    this.imageChangedEvent = '';
      this.croppedImage = '';
      this.show=false;
  }
}
