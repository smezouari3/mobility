import { UserService } from './../../../service/user.service';
import Swal from 'sweetalert2';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { Booking } from './../../../model/booking';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { VehicleCategory } from './../../../model/vehicleCategory';
import { VehicleType } from './../../../model/vehicleType';
import { Settings } from './../../../model/settings';
import { City } from './../../../model/city';
import { User } from './../../../model/user';
import { CityService } from './../../../service/city.service';
import { SettingsService } from './../../../service/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketService } from './../../../service/web-socket.service';
import { VehicleTypeService } from 'src/app/service/vehicle-type.service';
import { VehicleCategoryService } from './../../../service/vehicle-category.service';
import { AuthenticationService } from './../../../service/authentication.service';
import { BookingService } from './../../../service/booking.service';
import { NotificationService } from './../../../service/notification.service';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styleUrls: ['./booking-add.component.scss']
})
export class BookingAddComponent implements OnInit {



  public paymentTypes = [
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Paiement en ligne",disabled:true },
    { value: "Wallet", label: "Payer avec Portefeuille numérique" },
    { value: "Point", label: "Payer avec les points" },
  ];

  selectedPayment:string;

  public notifications = 0;
  cnt=0;
  myarray = [1, 2, 3, 4, 5]


  private subscriptions: Subscription[] = [];

  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  latLng: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker=new google.maps.Marker();
  destinationPin: google.maps.Marker=new google.maps.Marker();
  locationWatchId: number;

  movingPin: google.maps.Marker=new google.maps.Marker();
  movingPosition: google.maps.LatLng[];
  latLngMoving: google.maps.LatLngLiteral;

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  cities:City[]=[];
  city:City=new City();
  setting:Settings;
  vehicleTypes:VehicleType[];
  vehicleCategories:VehicleCategory[];
  cityId:number=0;
  cityFromId:number=0;

  pos = {
    lat: 0,
    lng: 0,
  };

  time: string = '';
  distance: string = '';
  distanceAmount: number = 0;
  placesText: string;
  note: string;

  area:boolean=false;

  count:number=0;

  vehicleTypeId:number=-1;

  dateBooking: NgbDateStruct;
  timeBooking = {hour: 13, minute: 30};
  currentDate:Date;
  point:number;
  dateNow = this.calendar.getToday();
  authUser:User;
  public host = environment.apiUrl;

  clients:User[];
  dropClients=[];
  selectedClient:User;



  constructor(private router:Router, public swPush:SwPush,public notifService:NotificationService, public service:BookingService,private authService:AuthenticationService, private calendar: NgbCalendar, public notificationService: NotificationsService,private settingService:SettingsService, private ngZone: NgZone, public cityService:CityService,
    private vehicleTypeService: VehicleTypeService, private vehicleCategoryService: VehicleCategoryService, private userService: UserService, private webSocketService: WebSocketService) {

      if(this.authService.isUserLoggedIn()==false){
        this.router.navigateByUrl('/login');
      }else{
        this.authUser=this.authService.getUserFromLocalCache();
        if(this.authUser.role=="ROLE_USER" || this.authUser.role=="ROLE_DRIVER"){
          this.router.navigateByUrl('/login');
        }else{
      /* let stompClient = this.webSocketService.connect();
        stompClient.connect({}, frame => {
          stompClient.subscribe('/topic/notification', async notifications => {
            console.log("I'm in booking");
            console.log(JSON.parse(notifications.body));
            if(JSON.parse(notifications.body).currentDriverLocalisation){
              console.log("im in if");
              console.log(JSON.parse(notifications.body).currentDriverLocalisation);
              let data:string=JSON.parse(notifications.body).currentDriverLocalisation[0];
              console.log(data);
              let driverId:number=+data.split("X")[0];
              // if(this.authUser.id==customer_id){
                let userId=data.split("X")[1];
                let fromString=data.split("X")[2];

                console.log(driverId);
                console.log(userId);
                console.log(fromString);

                let position:google.maps.LatLngLiteral;
                position={
                  lat:+fromString.split("§")[0],
                  lng:+fromString.split("§")[1]
                };
                // let to:google.maps.LatLngLiteral;
                // to={
                //   lat:+toString.split("§")[0],
                //   lng:+toString.split("§")[1]
                // };

                let icon={
                  url: './assets/imgs/car.svg',
                  anchor: new google.maps.Point(15, 30),
                  scaledSize: new google.maps.Size(50, 50)
                };
                // await this.getMoving(from,to);
                let movingPin:google.maps.Marker;
                this.movingVehicle(position,movingPin,icon,driverId.toString());

              // }

            }
          })
        }); */
        }
      }
    }


  async ngOnInit(){

    const resClients:any= await this.userService.getUsersByRole("ROLE_USER").toPromise();
    this.clients=resClients;
    console.log("clients");
    console.log(this.clients);
    for(let client of this.clients){
      let name=client.firstName+" "+client.lastName+'('+client.email+')';
      this.dropClients.push({value:client.id,label:name});
    }
    const res:any =await this.settingService.getRecordByKey("point").toPromise();
    this.setting=res;
    this.point=+this.setting.optionValue;

    this.currentDate=new Date();

    this.infoWindow = new google.maps.InfoWindow();

    this.timeBooking.hour=this.currentDate.getHours();
    this.timeBooking.minute=this.currentDate.getMinutes();



    // this.getCities();
    this.getCitiess();
    this.getVehicleTypes();
    this.getVehicleCategories();

    this.source = {
      lat: 0,
      lng:  0
    };

    this.destination = {
      lat: 0,
      lng:  0
    };

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // this.pos = {
          //   lat: 34.024165100138674,
          //   lng: -6.826897859573364,
          // };
          this.map.setCenter(this.pos);

          this.getAddress(this.pos.lat, this.pos.lng);
          setTimeout(() => {

            if (this.area == false) {
              this.notifier_error("Failed", "This area is not supported");
            }
            this.area = false;
          }, 2500);

        },
        () => {
          this.notifier_error("Error","Please Allow Localisation");
        }
      );
    } else {
      this.notifier_error("Failed","The Geolocation service failed. OR Your browser doesn't support geolocation.")
    }

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.pos,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: true,
      disableDoubleClickZoom: true,
      zoom: 16,
      zoomControl:true,
    });


    this.map.addListener("click", (event: google.maps.MapMouseEvent) => {
      this.addMarker(event.latLng!,this.map);
    });
  }


  handleAddressChange(event: any) {
    const lat = event.geometry.location.lat();
    const lng = event.geometry.location.lng();

    this.latLng = {
      lat: lat,
      lng: lng
    };

    this.addMarker(this.latLng,this.map);
  }

  onCenterMap() {
    this.map.panTo(this.source);
  }

  async addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral,map) {
    if(!this.sourcePin.getMap()){
      this.pinFrom(position,map);
    }else{
      if(!this.destinationPin.getMap()){
        this.pinTo(position,map);
      }
    }
    console.log(this.count);
    if(this.count==1){
      await this.setRoutePolyline();
    }

    if(this.movingPosition){
      console.log("movingPosition")
      console.log(this.movingPosition);
    }

  }

  panCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.addMarker(pos,this.map);
          this.map.setCenter(pos);
        },
        () => {
          this.notifier_error("Error","Please Allow Localisation");
        }
      );
    } else {
      this.notifier_error("Failed","The Geolocation service failed. OR Your browser doesn't support geolocation.")
    }
  }

  deleteMarkerFrom(){
    this.count--;
    this.city=null;
    this.cityId=0;
    this.sourcePin.setMap(null);
    this.source = {
      lat: 0,
      lng:  0
    };
  }

  deleteMarkerTo(){
    this.count--;
    this.destinationPin.setMap(null);
    this.destination = {
      lat: 0,
      lng:  0
    };
  }

  async pinFrom(position: google.maps.LatLng | google.maps.LatLngLiteral,map){
    this.sourcePin.setMap(null);
    this.sourcePin = new google.maps.Marker({
      position: position,
      icon: {
        url: './assets/imgs/location-from.svg',
        scaledSize: new google.maps.Size(50, 50),
      },
      animation: google.maps.Animation.DROP,
      map: map
    });

    this.source = {
      lat: this.sourcePin.getPosition().lat(),
      lng: this.sourcePin.getPosition().lng()
    };

    await this.checkArea(this.sourcePin);

    // setTimeout(() => {
      this.cityFromId=this.cityId;
      console.log(this.cityFromId);
      this.city=this.cities.find(x=>x.id==this.cityFromId);
    // }, 2500);



    if(this.source.lat==this.destination.lat && this.source.lng==this.destination.lng ){
      this.count--;
      this.sourcePin.setMap(null);
      this.notifier_error("ERROR","La source ne peut pas être la destination en même temps");
    }
  }

  async pinTo(position: google.maps.LatLng | google.maps.LatLngLiteral,map){
    this.destinationPin.setMap(null);
    this.destinationPin = new google.maps.Marker({
      position: position,
      icon: {
        url: './assets/imgs/location-to.svg',
        scaledSize: new google.maps.Size(50, 50),
      },
      animation: google.maps.Animation.DROP,
      map: map
    });

    this.destination = {
      lat: this.destinationPin.getPosition().lat(),
      lng:  this.destinationPin.getPosition().lng()
    };

    await this.checkArea(this.destinationPin);


    if(this.source.lat==this.destination.lat && this.source.lng==this.destination.lng ){
      this.count--;
      this.destinationPin.setMap(null);
      this.notifier_error("ERROR","La source ne peut pas être la destination en même temps")
    }

  }

  async checkArea(marker:google.maps.Marker) {
    console.log("im in check area");
    await this.getAddress(marker.getPosition().lat(), marker.getPosition().lng());
    this.count++;
      if (this.area == false) {
        this.count--;
        this.notifier_error("Failed", "This area is not supported");
        marker.setMap(null);
      }
      this.area = false;
  }

  getAddress( lat: number, lng: number) {
    return new Promise(resolve=>{
      let ville="";
      if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { location: latlng };
        geocoder.geocode(request, (results, status) => {

          if (status === google.maps.GeocoderStatus.OK) {
            let result = results[0];
            console.log(result.formatted_address);
            let rsltAdrComponent = result.address_components;
            if (result != null) {
              for(var rslt of rsltAdrComponent){
                if(rslt.types[0]=="locality"){
                  ville=this.replace(rslt.long_name);
                  break;
                }
              }
              if(this.cities){
                for(var city of this.cities){
                  if(city.enabled==true){
                    if(this.replace(city.name)==ville){
                      this.cityId=city.id;
                      this.area=true;
                      break;
                    }
                  }
                }
              }
            } else {
              alert('No address available!');
            }
          }
          resolve(this.area);
        });
      }
    });

  }

  /* getAddress( lat: number, lng: number):boolean {
    let ville="";
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      let request = { location: latlng };
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let result = results[0];
          let rsltAdrComponent = result.address_components;
          if (result != null) {
            for(var rslt of rsltAdrComponent){
              if(rslt.types[0]=="locality"){
                ville=this.replace(rslt.long_name);
                break;
              }
            }
            if(this.cities){
              for(var city of this.cities){
                if(city.enabled==true){
                  if(this.replace(city.name)==ville){
                    this.cityId=city.id;
                    this.area=true;
                    break;
                  }
                }
              }
            }
          } else {
            alert('No address available!');
          }
        }
      });
      return this.area;
    }
  } */

  async setRoutePolyline() {
    let request = {
      origin: this.source,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    await this.ds.route(request, (response, status) => {

      // console.log("request");
      // console.log(request);
      console.log("response");
      console.log(response);
      // console.log("status");
      // console.log(status);
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);
        this.movingPosition=response.routes[0].overview_path;

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
          // console.log("distanceInfo");
          // console.log(distanceInfo);
          this.distance = distanceInfo.distance.text;
          this.time = distanceInfo.duration.text;
          this.distanceAmount=parseInt(this.distance.replace(' km',''));
        });
      }
    });
  }

  replace(str: String) {
    var reg1 = /é/gi;
    var reg2 = /-/gi;
    var newstr = str.toLowerCase().replace(reg1, "e");
    var newstr = newstr.replace(reg2, " ");
    return newstr;
  }

  notifier_error(title:string,message:string){
    this.notificationService.error(title,message,{
      position:['top','right'],
      timeOut:3000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  clearPlacesField() {
    this.placesText = "";
  }

  // getCities() {
  //   this.subscriptions.push(
  //     this.cityService.getRecordsForMap().subscribe(
  //       (response: City[]) => {
  //         this.cities=response;
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         console.log(errorResponse);
  //       }
  //     )
  //   );
  // }

  async getCitiess() {
    const res:any =await this.cityService.getRecordsForMap().toPromise();
    this.cities=res;
    console.log(this.cities);
  }

  getVehicleTypes(): void {
    this.subscriptions.push(
      this.vehicleTypeService.getRecords().subscribe(
        (response: VehicleType[]) => {
          this.vehicleTypes = response;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  getVehicleCategories(): void {
    this.subscriptions.push(
      this.vehicleCategoryService.getRecords().subscribe(
        (response: VehicleCategory[]) => {
          this.vehicleCategories = response;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  submit(){
    let message:string="";
    let booking:Booking=new Booking();
    let date:Date;
    if(!this.selectedClient){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "S'il vous plaît choisir un client",
      })
    }else{
      console.log(this.selectedClient);
      this.selectedClient=this.clients.find(w=>w.id==this.selectedClient["value"]);
      console.log(this.selectedClient);
      if(this.vehicleTypeId==-1){
        message="S'il vous plaît choisir une véhicule";
      }
      else{
        if(this.selectedPayment){
          booking.paymentType=this.selectedPayment["value"];
          if(this.selectedPayment["value"]=="Point"){
            console.log(this.vehicleTypes.find(x=>x.id==this.vehicleTypeId).point*this.distanceAmount);
            console.log(this.selectedClient.point);
            if(this.selectedClient.point<(this.vehicleTypes.find(x=>x.id==this.vehicleTypeId).point*this.distanceAmount)){
              message="Votre solde de points est insuffisant";
            }else{console.log("ok");}
          }
        }else{
          message="Veuillez sélectionner un type de paiement";
        }
      }
      if(!this.dateBooking){
        message="Veuillez sélectionner une date";
      }else{
        let today = new Date();
        let tod=new Date(today.getFullYear(),today.getMonth(),today.getDate(),today.getHours(),today.getMinutes()-5);
        date=new Date(this.dateBooking.year,this.dateBooking.month-1,this.dateBooking.day,this.timeBooking.hour,this.timeBooking.minute);
        console.log(tod);
        console.log(date);
        console.log(date.getTime());
        console.log(tod.getTime());
        if(date.getTime()<tod.getTime()){
          message="Impossible de sélectionner une date avant la date actuelle";
        }
      }

      if(message!=""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: message,
        })
      }else{
        booking.fromLatitude=this.source.lat.toString();
        booking.fromLongitude=this.source.lng.toString();

        booking.toLatitude=this.destination.lat.toString();
        booking.toLongitude=this.destination.lng.toString();

        booking.distance=this.distanceAmount;
        booking.price=this.vehicleTypes.find(x=>x.id==this.vehicleTypeId).price*this.distanceAmount;

        booking.status="En attente";

        booking.customerId=this.selectedClient.id;
        booking.vehicle_type_id=this.vehicleTypeId;

        booking.dateTimeBooking=date;
        booking.note=this.note;
        booking.city_id=this.cityFromId;

        console.log(booking);

        this.subscriptions.push(
          this.service.addRecord(booking).subscribe(
            (response:CustomHttpRespone)=>{
              console.log(response);
              this.notifier_success('Succès','Votre réservation est créée');
              setTimeout(()=>{
                this.router.navigateByUrl["/my-booking"];
              },2500);
            },
            (errorResponse: HttpErrorResponse) => {
              this.notifier_error('Error',errorResponse.error.message);
            }
          ));
      }
    }

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
  select(vehicleTypeId:number){
    this.vehicleTypeId=vehicleTypeId;
  }

  myLoop(movingPosition: google.maps.LatLng[]) {
    console.log(movingPosition);
    console.log(movingPosition.length);
    console.log(this.cnt);
    while(this.cnt < movingPosition.length){

    setTimeout(function() {
      console.log("x")
        console.log(this.cnt);
        console.log(movingPosition.values[this.cnt]);
    }, 2000);
  }

  }

  interv(i) {
    var array = [1, 2, 3, 4, 5];
    var cot=0;
    var intId=setInterval(()=>{
      console.log(array[cot]);
      cot++;
      if(cot==5){
        clearInterval(intId);
      }
    },1000);
    console.log(intId);
  }

  submits(){

    console.log(this.source);
    console.log(this.destination);

    console.log("im in sub");

    if(!this.swPush.isEnabled){
      console.log("notif is not enabled");
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: 'BC3T1PtW5fQbvK9EXrq-LmQ2r6ZwdDUh246cm5HEUUJXzGhxBxaxcrTxCSIPxqElYH_HapJCRrk0B6y-FlcV35M',
    })
    .then((sub) => console.log(JSON.stringify(sub)))
    .catch((err)=>console.log(JSON.stringify(err)));

    console.log("im in sub end");

    // this.subscriptions.push(
    //   this.service.notif().subscribe(
    //     (response:String)=>{
    //       console.log(response);
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log(errorResponse);
    //     }
    //   ));

    /* this.locationWatchId=navigator.geolocation.watchPosition(
      (position)=>{
        console.log(position);
    //     this.source={
    //       lat:position.coords.latitude,
    //       lng:position.coords.longitude,
    //     };
    //     if(this.sourcePin){
    //       console.log("im in the source pine");
    //       this.sourcePin.setPosition(this.source);
    //     }
      },
      (error)=>{
        console.log("error");
        console.log(error);
      }
    ); */

    // this.movingPin = new google.maps.Marker({
    //   position: this.source,
    //   icon: {
    //     url: './assets/imgs/car.svg',
    //     anchor: new google.maps.Point(15, 30),
    //     scaledSize: new google.maps.Size(50, 50)
    //     // scale:10,
    //   },
    //   // animation: google.maps.Animation.BOUNCE,
    //   map: this.map
    // });
    // var count=0;
    // var intId=setInterval(()=>{
    //   this.latLngMoving=this.movingPosition[count].toJSON();
    //   this.movingPin.setPosition(this.latLngMoving);
    //   // console.log(this.movingPosition[count].toString());
    //   count++;
    //   if(count==this.movingPosition.length){
    //     clearInterval(intId);
    //   }
    // },1000);
  }

  movingVehicle(latLngMovingPosition:google.maps.LatLngLiteral, movingPin:google.maps.Marker=new google.maps.Marker(), icon:any,id:string){
    movingPin = new google.maps.Marker({
    position: latLngMovingPosition,
    label:id,
    icon: icon,
    // animation: google.maps.Animation.BOUNCE,
    map: this.map
    });
    movingPin.setPosition(latLngMovingPosition);
  // var count=0;
  // var intId=setInterval(()=>{
  //   latLngMovingPosition=movingPosition[count].toJSON();
  //   movingPin.setPosition(latLngMovingPosition);
  //   // console.log(this.movingPosition[count].toString());
  //   count++;
  //   if(count==movingPosition.length){
  //     clearInterval(intId);
  //   }
  // },2000);
}




}
