import { AuthenticationService } from './../../service/authentication.service';
import { User } from './../../model/user';
import { Component, NgZone, OnInit } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  authUser: User;

  showMapPill: boolean;
  mapLoaded: boolean;
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;

  time: string = '';
  distance: string = '';

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker;
  destinationPin: google.maps.Marker;

  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    zoom: 12,
    zoomControl:true,
    streetViewControl:true
  }

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  placesText: string;
  togglePlacesSearch: boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private ngZone: NgZone) {}

  ngOnInit() {

    this.authUser = this.authenticationService.getUserFromLocalCache();
    console.log(this.authUser);

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });

    navigator.geolocation.getCurrentPosition(position => {

      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.destination = this.center;

      // initialize the map container
      this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        ...this.options,
        center: this.destination
      });

      this.map.addListener('tilesloaded', () => {
        this.ngZone.run(() => {
          this.mapLoaded = true;
        });
      });

      this.destinationPin = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: './assets/imgs/destination_custom_pin.svg',
          anchor: new google.maps.Point(35,10),
          scaledSize: new google.maps.Size(100, 100)
        },
        map: this.map
      });

      this.map.addListener("click", (event: any) => {
        this.showMapPill = false;
      });

    });
  }

  handleAddressChange(event: any) {
    const lat = event.geometry.location.lat();
    const lng = event.geometry.location.lng();

    this.source = {
      lat: lat,
      lng: lng
    };

    console.log(this.source);

    if (!this.sourcePin) {
      // adding a marker
      this.sourcePin = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/imgs/truck_pin.svg',
          anchor: new google.maps.Point(35,10),
          scaledSize: new google.maps.Size(100, 100)
        },
        animation: google.maps.Animation.DROP,
        map: this.map
      });

      this.sourcePin.addListener("click", (event: any) => {
        this.showMapPill = true;
        this.onCenterMap();
      });
      console.log(this.sourcePin);
    }
    else {
      this.sourcePin.setPosition(this.source);
    }

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

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
          this.distance = distanceInfo.distance.text;
          this.time = distanceInfo.duration.text;
        });
      }
    })
  }

  onCenterMap() {
    this.map.panTo(this.source);
  }

  onLogout() {
    this.authenticationService.logOut();
  }

  clearPlacesField() {
    this.placesText = "";
  }

  toggleSearch() {
    this.togglePlacesSearch = !this.togglePlacesSearch;
  }
}
