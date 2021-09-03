import { async } from '@angular/core/testing';
import { Driver } from './../../model/driver';
import { User } from 'src/app/model/user';
import { WebSocketService } from './../../service/web-socket.service';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { AuthenticationService } from './../../service/authentication.service';
import { UserService } from './../../service/user.service';
import { Booking } from './../../model/booking';
import { VehicleCategory } from './../../model/vehicleCategory';
import { VehicleCategoryService } from './../../service/vehicle-category.service';
import { VehicleType } from './../../model/vehicleType';
import { VehicleTypeService } from 'src/app/service/vehicle-type.service';
import { NavService } from './../../shared/services/nav.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CityService } from './../../service/city.service';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Component, OnInit, NgZone } from '@angular/core';
import {} from 'googlemaps';
import { City } from 'src/app/model/city';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Time } from '@angular/common';
import { BookingService } from 'src/app/service/booking.service';
const geocoder = new google.maps.Geocoder();
const infowindow = new google.maps.InfoWindow();
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  public notifications = 0;

  private subscriptions: Subscription[] = [];

  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  latLng: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker=new google.maps.Marker();
  destinationPin: google.maps.Marker=new google.maps.Marker();

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  cities:City[]=[];
  city:City=new City();
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

  area:boolean=false;

  count:number=0;

  vehicleTypeId:number;

  dateBooking: NgbDateStruct;
  timeBooking = {hour: 13, minute: 30};
  currentDate:Date;


  constructor(public service:BookingService, public notificationService: NotificationsService, private ngZone: NgZone, public cityService:CityService,
    private vehicleTypeService: VehicleTypeService, private vehicleCategoryService: VehicleCategoryService, private auth: AuthenticationService, private webSocketService: WebSocketService) {
    }


  ngOnInit(){

    this.currentDate=new Date();

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
      zoom: 14,
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

  addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral,map) {
    if(!this.sourcePin.getMap()){
      this.pinFrom(position,map);
    }else{
      if(!this.destinationPin.getMap()){
        this.pinTo(position,map);
      }
    }
    this.setRoutePolyline();
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

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
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

  notifier_error(title:string,message:string,timout=null){
    if(timout==null){
      this.notificationService.error(title,message,{
        position:['top','right'],
        // timeOut:2500,
        animate:'fade',
        showProgressBar:true,
        clickToClose: true,
        clickIconToClose: true
      });
    }else{
      this.notificationService.error(title,message,{
        position:['top','right'],
        timeOut:2500,
        animate:'fade',
        showProgressBar:true,
        // clickToClose: true,
        // clickIconToClose: true
      });
    }

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
    let message:String="";
    /* if(this.vehicleTypeId==0){
      message="S'il vous plaît choisir une véhicule";
    } */
    // let date: Date=new Date(this.dateBooking.year,this.dateBooking.month,this.dateBooking.day,this.timeBooking.hour,this.timeBooking.minute);

    let booking:Booking=new Booking();
    // booking.fromLatitude=this.source.lat.toString();
    // booking.fromLongitude=this.source.lng.toString();

    // booking.toLatitude=this.destination.lat.toString();
    // booking.toLongitude=this.destination.lng.toString();

    // booking.distance=this.distanceAmount;
    // booking.price=this.vehicleTypes.find(x=>x.id==this.vehicleTypeId).price*this.distanceAmount;

    // booking.status="En attente";
    // booking.paymentType="Cash";

    // booking.customerId=this.auth.getUserFromLocalCache().id;
    // booking.vehicle_type_id=this.vehicleTypeId;

    // booking.dateTimeBooking=date;

    console.log(booking);

    this.subscriptions.push(
      this.service.addRecord(booking).subscribe(
        (response:CustomHttpRespone)=>{
          console.log(response);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      ));

  }

  select(vehicleTypeId:number){
    this.vehicleTypeId=vehicleTypeId;
  }

}
