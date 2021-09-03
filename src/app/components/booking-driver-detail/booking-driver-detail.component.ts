import { RatingService } from './../../service/rating.service';
import { UserService } from 'src/app/service/user.service';
import { Settings } from './../../model/settings';
import { SettingsService } from './../../service/settings.service';
import { AuthenticationService } from './../../service/authentication.service';
import { User } from './../../model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { Subscription } from 'rxjs';
import { Rating } from './../../model/rating';
import { DriverService } from './../../service/driver.service';
import { VehicleTypeService } from './../../service/vehicle-type.service';
import { VehicleType } from './../../model/vehicleType';
import { Booking } from './../../model/booking';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/service/booking.service';
import { Driver } from 'src/app/model/driver';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
@Component({
  selector: 'app-booking-driver-detail',
  templateUrl: './booking-driver-detail.component.html',
  styleUrls: ['./booking-driver-detail.component.scss']
})
export class BookingDriverDetailComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  authUser:User;

  driverRate=0;
  appRate=0;
  id=0;
  placesText="";
  vehicleType:VehicleType;
  booking:Booking=new Booking();
  setting:Settings=null;
  customer:User=null;
  rating:Rating=null;
  map: google.maps.Map;

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  movingPosition1: google.maps.LatLng[];
  // movingPosition2: google.maps.LatLng[];
  // movingPosition3: google.maps.LatLng[];

  latLngMovingPosition1: google.maps.LatLngLiteral;
  // latLngMovingPosition2: google.maps.LatLngLiteral;
  // latLngMovingPosition3: google.maps.LatLngLiteral;

  movingPin1: google.maps.Marker=new google.maps.Marker();
  // movingPin2: google.maps.Marker=new google.maps.Marker();
  // movingPin3: google.maps.Marker=new google.maps.Marker();


  sourcePin: google.maps.Marker=new google.maps.Marker();
  destinationPin: google.maps.Marker=new google.maps.Marker();

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;


  fromAdress:any;
  toAdress:any;

  public host = environment.apiUrl;


  constructor(private route: ActivatedRoute, private router:Router,private notificationService:NotificationsService,private ratingService:RatingService, private settingService:SettingsService, private authService:AuthenticationService, private bookingService:BookingService, private vehicleTypeService:VehicleTypeService,private userService:UserService) {

    if(this.authService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authService.getUserFromLocalCache();
      if(this.authUser.role!="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }else{
        this.customer=new User();
        this.vehicleType=new VehicleType();
        this.route.paramMap.subscribe( params => {
          this.id = parseInt(params.get('id'));
        });
      }
    }
  }
  async ngOnInit(){
    const res:any =await this.bookingService.getBooking(this.id).toPromise();
    this.booking=res;
    console.log(this.booking);
    if(this.booking==null){
      this.router.navigateByUrl("/notification");
    }else{

      if(this.booking.driver_id!=null){
        if(this.booking.driver_id!=this.authUser.driver.id){
          this.router.navigateByUrl("/notification");
        }
        const res2:any= await this.userService.userGet(this.booking.customerId).toPromise();
        this.customer=res2;
        console.log(this.customer);

        const res4:any= await this.ratingService.getBooking(this.booking.id).toPromise();
        this.rating=res4;
        if(this.rating!=null){
          this.driverRate=this.rating.rating;
          this.placesText=this.rating.review;
        }

      }

      if(this.booking.vehicle_type_id!=null){
        const res3:any= await this.vehicleTypeService.getRecordWithId(this.booking.vehicle_type_id).toPromise();
        this.vehicleType=res3;
        console.log(this.vehicleType);
      }else{
        this.vehicleType=new VehicleType();
      }

      this.loadMap();

      await this.getFromAddress(+this.booking.fromLatitude,+this.booking.fromLongitude);
      await this.getToAddress(+this.booking.toLatitude,+this.booking.toLongitude);
    }
  }

  loadMap(){
    this.ds = new google.maps.DirectionsService();
      this.dr = new google.maps.DirectionsRenderer({
        map: null,
        suppressMarkers: true
      });

      this.source = {
        lat: Number(this.booking.fromLatitude),
        lng: Number(this.booking.fromLongitude)
      };

      this.destination = {
        lat: Number(this.booking.toLatitude),
        lng: Number(this.booking.toLongitude)
      };

      this.map = new google.maps.Map(document.getElementsByClassName("map")[0] as HTMLElement, {
        center: this.source,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        zoom: 14,
        zoomControl:true,
      });

      this.map.panTo(this.source);


      this.sourcePin = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/imgs/location-from.svg',
          scaledSize: new google.maps.Size(50, 50),
        },
        animation: google.maps.Animation.DROP,
        map: this.map
      });

      this.destinationPin = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: './assets/imgs/location-to.svg',
          scaledSize: new google.maps.Size(50, 50),
        },
        animation: google.maps.Animation.DROP,
        map: this.map
      });
      this.setRoutePolyline(this.source,this.destination);

  }

  setRoutePolyline(source:google.maps.LatLngLiteral,destination:google.maps.LatLngLiteral) {
    let request = {
      origin: source,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.ds.route(request, (response, status) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);
      }
    });
  }

  async getMoving(source:google.maps.LatLngLiteral,destination:google.maps.LatLngLiteral) {
    let request = {
      origin: source,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    await this.ds.route(request, (response, status) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.movingPosition1=response.routes[0].overview_path;
        // this.dr.setDirections(response);
      }
    });
  }

  movingVehicle(movingPosition:google.maps.LatLng[]){
    this.movingPin1 = new google.maps.Marker({
      position: this.latLngMovingPosition1,
      icon: {
        url: './assets/imgs/car.svg',
        anchor: new google.maps.Point(15, 30),
        scaledSize: new google.maps.Size(50, 50)
        // scale:10,
      },
      // animation: google.maps.Animation.BOUNCE,
      map: this.map
    });
    var count=0;
    var intId=setInterval(()=>{
      this.latLngMovingPosition1=movingPosition[count].toJSON();
      this.movingPin1.setPosition(this.latLngMovingPosition1);
      // console.log(this.movingPosition[count].toString());
      count++;
      if(count==movingPosition.length){
        clearInterval(intId);
      }
    },2000);
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

  redirectToCustomer(customerId){
    console.log("im in redirectToCustomer");
    console.log(customerId);
  }


  notifier_success(title:string,message:string){
    this.notificationService.success(title,message,{
      position:['top','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  notifier_error(title:string,message:string){
    this.notificationService.error(title,message,{
      position:['top','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  getOrder(){

    this.booking.driver_id=this.authUser.driver.id;
    this.booking.vehicle_id=this.authUser.driver.vehicle.id;
    this.booking.status="Confirmer";
    console.log(this.booking);

    swalWithBootstrapButtons.fire({
      title: 'Vous êtes sur?',
      text: "Vous ne pourrez pas annuler après la confirmation",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Non, Annuler!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.subscriptions.push(
          this.bookingService.setDriver(this.booking).subscribe(
            (response:CustomHttpRespone)=>{
              swalWithBootstrapButtons.fire(
                'Succès',
                response.message,
                'success'
              )
              console.log("success");
              console.log(response);
            },
            (errorResponse: HttpErrorResponse) => {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                errorResponse.error.message,
                'error'
              )
            }
          ));
      }
     /*  else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      } */
    });
  }

  async startOrder(){
    let from:google.maps.LatLngLiteral;

    from={
      lat:+this.booking.fromLatitude-0.03143434927281,
      lng:+this.booking.fromLongitude-0.045034690108261
    };

    // from.lat=32.343133198845905;
    // from.lng=-6.342306826044772;
    let to:google.maps.LatLngLiteral;

    to={
      lat:+this.booking.fromLatitude,
      lng:+this.booking.fromLongitude
    };
    // to.lat=+this.booking.fromLatitude;
    // to.lng=+this.booking.fromLongitude;

    let pos:string=from.lat.toString()+'§'+from.lng.toString()+'X'+to.lat.toString()+'§'+to.lng.toString()

    await this.getMoving(from,to);
    this.movingVehicle(this.movingPosition1);

    this.booking.status='Lancer';
    this.subscriptions.push(
      this.bookingService.bookingStart(this.booking,pos).subscribe(
        (response:CustomHttpRespone)=>{
          this.notifier_success("Succes","La reservation est Lancer");
          console.log("success");
          console.log(response);
          this.movingVehicle(this.movingPosition1);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error("Erreur","Erreur, réessayer ulterieurement");
        }
      ));
  }

  async letsGo(){

    /* let from:google.maps.LatLngLiteral;
    from={
      lat:32.343133198845905,
      lng:-6.342306826044772
    };

    let to:google.maps.LatLngLiteral;
    to={
      lat:+this.booking.fromLatitude,
      lng:+this.booking.fromLongitude
    };

    await this.getMoving(from,to);
    this.movingVehicle(this.movingPosition1); */

    this.booking.status='En cours';
    this.subscriptions.push(
      this.bookingService.updateBooking(this.booking).subscribe(
        (response:CustomHttpRespone)=>{
          this.notifier_success("Succes","La reservation est En cours");
          console.log("success");
          console.log(response);
          this.movingVehicle(this.movingPosition1);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error("Erreur","Erreur, réessayer ulterieurement");
        }
      ));
  }

  async notifCustomer(){
    this.booking.status='En cours';
    this.subscriptions.push(
      this.bookingService.notifyCustomer(this.booking).subscribe(
        (response:CustomHttpRespone)=>{
          this.notifier_success("Succes","Le client est notifié");
          console.log("success");
          console.log(response);
          this.movingVehicle(this.movingPosition1);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error("Erreur","Erreur, réessayer ulterieurement");
        }
      ));
  }

  async complete(){

    const res:any =await this.settingService.getRecordByKey("profit_driver").toPromise();
    this.setting=res;

    let profit:number=+this.setting.optionValue;

    profit=this.booking.price*profit/100;

    this.booking.status="Terminer";
    console.log(this.booking);

    if(this.booking.paymentType=="Cash"){
      swalWithBootstrapButtons.fire({
        title: 'Voulez vous collecter maintenant votre gain en espèces ?',
        text: "Votre gain est : "+profit,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

          this.subscriptions.push(
            this.bookingService.complete(this.booking,true).subscribe(
              (response:CustomHttpRespone)=>{
                swalWithBootstrapButtons.fire(
                  'Succès',
                  response.message,
                  'success'
                )
                console.log("success");
                console.log(response);
              },
              (errorResponse: HttpErrorResponse) => {
                swalWithBootstrapButtons.fire(
                  'Cancelled',
                  errorResponse.error.message,
                  'error'
                )
              }
            ));
        }
        else if ( result.dismiss === Swal.DismissReason.cancel) {
          this.subscriptions.push(
            this.bookingService.complete(this.booking,false).subscribe(
              (response:CustomHttpRespone)=>{
                swalWithBootstrapButtons.fire(
                  'Succès',
                  response.message,
                  'success'
                )
                console.log("success");
                console.log(response);
              },
              (errorResponse: HttpErrorResponse) => {
                swalWithBootstrapButtons.fire(
                  'Cancelled',
                  errorResponse.error.message,
                  'error'
                )
              }
            ));
        }
      });
    }else{
      this.subscriptions.push(
        this.bookingService.complete(this.booking,false).subscribe(
          (response:CustomHttpRespone)=>{
            swalWithBootstrapButtons.fire(
              'Succès',
              response.message,
              'success'
            )
            console.log("success");
            console.log(response);
          },
          (errorResponse: HttpErrorResponse) => {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              errorResponse.error.message,
              'error'
            )
          }
        ));
    }
  }
}
