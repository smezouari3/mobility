import { UserService } from './../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { DriverService } from './../../../service/driver.service';
import { VehicleTypeService } from './../../../service/vehicle-type.service';
import { RatingService } from './../../../service/rating.service';
import { BookingService } from './../../../service/booking.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from './../../../service/authentication.service';
import { WebSocketService } from './../../../service/web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './../../../model/user';
import { Rating } from './../../../model/rating';
import { Driver } from './../../../model/driver';
import { Booking } from './../../../model/booking';
import { VehicleType } from './../../../model/vehicleType';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-bookings-detail',
  templateUrl: './bookings-detail.component.html',
  styleUrls: ['./bookings-detail.component.scss']
})
export class BookingsDetailComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  driverRate=0;
  appRate=0;
  id:any;
  placesText="";
  vehicleType:VehicleType=null;
  booking:Booking=new Booking();
  driver:Driver;
  customer:User;
  rating:Rating=null;
  map: google.maps.Map;
  driverSelected=[];
  drivers:Driver[];

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker=new google.maps.Marker();
  destinationPin: google.maps.Marker=new google.maps.Marker();
  locationWatchId: number;

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;
  authUser:User;

  fromAdress:any;
  toAdress:any;
  movingPosition1: google.maps.LatLng[];
  // movingPosition2: google.maps.LatLng[];
  // movingPosition3: google.maps.LatLng[];

  latLngMovingPosition1: google.maps.LatLngLiteral;
  // latLngMovingPosition2: google.maps.LatLngLiteral;
  // latLngMovingPosition3: google.maps.LatLngLiteral;

  movingPin1: google.maps.Marker=new google.maps.Marker();
  // movingPin2: google.maps.Marker=new google.maps.Marker();
  // movingPin3: google.maps.Marker=new google.maps.Marker()

  public host = environment.apiUrl;
  driverId=0;

  slctDrive:any;

  constructor(private route: ActivatedRoute,private webSocketService: WebSocketService, private userService:UserService, private router:Router,private authService:AuthenticationService,private notificationService:NotificationsService , private bookingService:BookingService, private ratingService:RatingService, private vehicleTypeService:VehicleTypeService,private driverService:DriverService) {

    if(this.authService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authService.getUserFromLocalCache();
      if(this.authUser.role=="ROLE_USER" || this.authUser.role=="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }else{
        let stompClient = this.webSocketService.connect();
        stompClient.connect({}, frame => {
          stompClient.subscribe('/topic/notification', async notifications => {
            console.log("I'm in start driver in booking detail");
            console.log(JSON.parse(notifications.body));
            if(JSON.parse(notifications.body).currentLocation){
              console.log("im in if");
              console.log(JSON.parse(notifications.body).currentLocation);
              console.log();
              let data:string=JSON.parse(notifications.body).currentLocation[0];
              let customer_id:number=+data.split("X")[0];
              // if(this.authUser.id==customer_id){
                let fromString=data.split("X")[1];
                let toString=data.split("X")[2];

                console.log(customer_id);
                console.log(fromString);
                console.log(toString);

                let from:google.maps.LatLngLiteral;
                from={
                  lat:+fromString.split("§")[0],
                  lng:+fromString.split("§")[1]
                };
                let to:google.maps.LatLngLiteral;
                to={
                  lat:+toString.split("§")[0],
                  lng:+toString.split("§")[1]
                };

                let icon={
                  url: './assets/imgs/car.svg',
                  anchor: new google.maps.Point(15, 30),
                  scaledSize: new google.maps.Size(50, 50)
                  // scale:10,
                };
                await this.getMoving(from,to);
                this.movingVehicle(this.movingPosition1,icon);
              // }

            }
          })
        });
        this.customer=new User();
        this.driver=new Driver();
        this.driver.userInfo=new User();
        this.vehicleType=new VehicleType();
        this.route.paramMap.subscribe( params => {
          this.id = parseInt(params.get('id'));
        });
      }
    }
  }

  async ngOnInit(){
    console.log("this is id");
    console.log(this.id);

    const res:any =await this.bookingService.getBooking(this.id).toPromise();
    this.booking=res;
    console.log(this.booking);
    if(this.booking==null){
      this.router.navigateByUrl("/orders");
    }else{
      const res2:any=await this.userService.getUsers().toPromise();
      let usrs:User[]=res2;

      const res3:any=await this.driverService.getDrivers().toPromise();
      let drv:Driver[]=res3;

      for(let driver of drv){
        if(driver.vehicle){
          let user:User=usrs.find(x=>x.id==driver.userId);
          let ids=driver.id+"-"+driver.vehicle.id;
          let obj = {key:ids,value:user.firstName+" "+user.lastName};
          this.driverSelected.push(obj);
        }
      }
      console.log(this.driverSelected);

      if(this.booking.driver_id!=null){
        const res2:any= await this.driverService.getDriver(this.booking.driver_id).toPromise();
        this.driver=res2;


        const res4:any= await this.ratingService.getBooking(this.booking.id).toPromise();
        this.rating=res4;
        if(this.rating!=null){
          this.driverRate=this.rating.rating;
          this.placesText=this.rating.review;
        }else{
        //   console.log("this is rating");
        // console.log(this.rating);
        }

      }
      console.log(this.driver);

      const res5:any=await this.userService.userGet(this.booking.customerId).toPromise();
      this.customer=res5;


      if(this.booking.vehicle_type_id!=null){
        const res3:any= await this.vehicleTypeService.getRecordWithId(this.booking.vehicle_type_id).toPromise();
        this.vehicleType=res3;
        // console.log(this.vehicleType);
      }else{
        this.vehicleType=new VehicleType();
      }

      this.loadMap();

      await this.getFromAddress(+this.booking.fromLatitude,+this.booking.fromLongitude);
      await this.getToAddress(+this.booking.toLatitude,+this.booking.toLongitude);
      // console.log(this.booking);
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
      this.setRoutePolyline();

  }

  setRoutePolyline() {
    let request = {
      origin: this.source,
      destination: this.destination,
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

  redirectToDriver(driverId){
    console.log(driverId);
    this.router.navigateByUrl("driverprofil/"+driverId);
  }

  redirectToUser(customerId){
    console.log(customerId);
    this.router.navigateByUrl("driverprofil/"+customerId);
  }

  driverRating(){
    setTimeout(()=>{
      if(this.driverRate>0){
        let rat=new Rating();
        rat.rating=this.driverRate;
        rat.review=this.placesText;
        rat.bookingId=this.booking.id;
        rat.driverId=this.booking.driver_id;
        // console.log(rat);

        this.subscriptions.push(
          this.ratingService.addRecord(rat).subscribe(
            (response:CustomHttpRespone)=>{
              this.notifier_success("Succes","Merci pour votre évaluation");
              this.rating=rat;
              console.log("success");
              console.log(response);
            },
            (errorResponse: HttpErrorResponse) => {
              this.notifier_error("Erreur","Vous ne pouvez pas évaluer maintenant, réessayer ulterieurement");
            }
          ));
      }
    },1000);
  }

  cancelOrder(){
    console.log("im in cancell");
    if(this.booking.status=='En attente' || this.booking.status=='Confirmer'){
      swalWithBootstrapButtons.fire({
        title: 'Vous êtes sur?',
        text: "Voulez-vous annuler cette réservation ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Fermer',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // this.booking.status="Annuler";
      this.subscriptions.push(
        this.bookingService.cancelBooking(this.booking).subscribe(
          (response:CustomHttpRespone)=>{
            this.notifier_success("Succes","La reservation est annuler");
            console.log("success");
            console.log(response);
          },
          (errorResponse: HttpErrorResponse) => {
            this.notifier_error("Erreur","Vous ne pouvez pas annuler cette réservation maintenant, réessayer ulterieurement");
          }
        ));
        }
      });
    }
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

  movingVehicle(movingPosition:google.maps.LatLng[],icon:any){
    this.movingPin1 = new google.maps.Marker({
      position: this.latLngMovingPosition1,
      icon: icon,
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
    if(this.slctDrive){
      console.log(this.slctDrive);
      this.booking.driver_id=+this.slctDrive.split('-')[0];
      this.booking.vehicle_id=+this.slctDrive.split('-')[1];
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
  }

}
