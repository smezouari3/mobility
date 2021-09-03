import { UserService } from './../../../service/user.service';
import { BookingService } from './../../../service/booking.service';
import { VehicleTypeService } from './../../../service/vehicle-type.service';
import { DriverService } from './../../../service/driver.service';
import { WebSocketService } from './../../../service/web-socket.service';
import { VehicleType } from './../../../model/vehicleType';
import { Driver } from './../../../model/driver';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/model/booking';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/user';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  bookings:Booking[];
  filtredBooking:Booking[];
  selectedBookings:Booking[];
  authUser:User;
  loading: boolean = true;
  fromAdress:any;
  toAdress:any;
  data=[];
  filtredData=[];
  // dataPagination=[];
  // filtredDataPagination=[];
  driver:Driver;
  customer:User;
  vehicleType:VehicleType;
  statut:string;
  placesText:string="";
  currentPage=1;
  selectedSize=10;
  sizing=[10,20,50,100];

  public host = "http://localhost:8081";

  public periode = [
    { value: "2629800000", label: "1 Mois" },
    { value: "7889400000", label: "3 Mois" },
    { value: "15778800000", label: "6 Mois" },
    { value: "31557600000", label: "12 Mois" },
    { value: "all", label: "Tous" },
  ];

  selectedPeriode={ value: "2629800000", label: "1 Mois" };




  constructor(private webSocketService: WebSocketService,private userService:UserService, private driverService:DriverService,private vehicleTypeService:VehicleTypeService, private modalService: NgbModal, private authService:AuthenticationService,public bookingService:BookingService, public router:Router) {
    if(this.authService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authService.getUserFromLocalCache();
      if(this.authUser.role=="ROLE_USER" || this.authUser.role=="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }
    }
  }

  async ngOnInit() {
    this.driver=new Driver();
    this.customer=new User();
    this.driver.userInfo=new User();
    this.statut="All";
    const res:any =await this.bookingService.getBookings().toPromise();
    this.bookings=res;
    this.loading=false;

    this.bookings=this.bookings.sort((x, y) => +new Date(y.dateTimeBooking) - +new Date(x.dateTimeBooking));

    this.filtredBooking=this.bookings;
    await this.getData();
    this.filtredData=this.data;

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


  filterStatus(statut:string){
    this.statut=statut;
    if(statut!='All'){
      this.filtredBooking=this.bookings.filter(bk=>bk.status==statut);
    }else{
      this.filtredBooking=this.bookings;
    }
    this.getData();
  }

  async getData(){
    this.data=[];
    for(let booking of this.filtredBooking){
      console.log("*********************************************************************");
      console.log("booking");
      this.vehicleType=new VehicleType()
      await this.getFromAddress(+booking.fromLatitude,+booking.fromLongitude);
      await this.getToAddress(+booking.toLatitude,+booking.toLongitude);
      this.driver=new Driver();
      this.driver.userInfo=new User();
      if(booking.driver_id){
        console.log("im in driver id")
        const res2:any= await this.driverService.getDriver(booking.driver_id).toPromise();
        this.driver=res2;
        console.log(this.driver);
      }console.log("end if")

      const res5:any=await this.userService.userGet(booking.customerId).toPromise();
      this.customer=res5;
      if(booking.vehicle_type_id){
        const res3:any= await this.vehicleTypeService.getRecordWithId(booking.vehicle_type_id).toPromise();
        this.vehicleType=res3;
      }
      let obj={"booking":booking,"driver":this.driver,"customer":this.customer,"vehicleType":this.vehicleType,"from_adress":this.fromAdress,"to_adress":this.toAdress};
      this.data.push(obj);

    }
    this.filtredData=this.data;
    console.log(this.filtredData.length);
  }

  filter() {
    this.filtredBooking=this.bookings.filter(bk=>bk.status.includes(this.placesText.toLowerCase()));
    this.filtredData=this.data.filter(x=>x.booking.status.toLowerCase().includes(this.placesText.toLowerCase())
                              || x.booking.price.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.booking.distance.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.booking.dateTimeBooking.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.from_adress.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.to_adress.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.vehicleType.name.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.driver.userInfo.firstName.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              || x.driver.userInfo.lastName.toString().toLowerCase().includes(this.placesText.toLowerCase())
                              );
    console.log(this.data);

  }

  changePeriode(event:any){
    if(this.selectedPeriode){
      if(this.selectedPeriode["value"]!="all"){
        let periodeMilliSeconde=+this.selectedPeriode["value"];
        var time = new Date().getTime() - periodeMilliSeconde;
        this.filtredBooking=this.bookings.filter(
          (w)=>{
            var date = new Date(w.dateTimeBooking); // some mock date
            var milliseconds = date.getTime();
            if(milliseconds>time){
              return true;
            }
          });
      }else{
        this.filtredBooking=this.bookings;
      }
    }
    this.getData();
  }


  clear(){
    this.placesText='';
    this.statut='All';
    this.filterStatus(this.statut);
  }
  redirect(bookingId){
    this.router.navigateByUrl("dashboard/booking/"+bookingId);
  }


}
