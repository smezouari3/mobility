import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../../../../../model/custom-http-response';
import { DriverService } from './../../../../../../service/driver.service';
import { UserService } from './../../../../../../service/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../../../../service/authentication.service';
import { User } from './../../../../../../model/user';

import { Component, OnInit } from '@angular/core';
import { LocalisationService } from 'src/app/service/localisation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-the-account',
  templateUrl: './the-account.component.html',
  styleUrls: ['./the-account.component.scss']
})
export class TheAccountComponent implements OnInit {

  public host = "http://localhost:8081";

  private subscriptions: Subscription[] = [];
  public menu=false;
  authUser:User;
  logged:boolean=false;
  locationWatchId: number;

  position: google.maps.LatLngLiteral;



  constructor(private authService:AuthenticationService,private driverService:DriverService,private localisationService:LocalisationService, private router:Router) {
    if(this.authService.isUserLoggedIn()){
      this.logged=true;
    }
   }

   ngOnInit() {
    this.authUser=this.authService.getUserFromLocalCache();
    console.log(this.authUser);

    /* if(this.authUser.driver!=null){
      this.locationWatchId=navigator.geolocation.watchPosition(
        async (position)=>{
          console.log(position);
          this.position={
            lat:position.coords.latitude,
            lng:position.coords.longitude,
          };

          let pos:string=this.authUser.driver.id+'X'+this.authUser.driver.userId+'X'+this.position.lat.toString()+'§'+this.position.lng.toString();
          let rep:any=await this.localisationService.addRecord(pos).toPromise();
          console.log(rep);

        },
        (error)=>{
          console.log("error");
          console.log(error);
        }
      );
    } */


  }


  menuToggle(){
    this.menu=!this.menu;
  }

  logout(){
    this.authUser.driver.available=false;
    this.subscriptions.push(
      this.driverService.updatRecord(this.authUser.driver).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
        }
      )
    );
    this.authService.logOut();
    this.router.navigateByUrl("/login");
  }

  changeState(event:any){

    this.subscriptions.push(
      this.driverService.updatRecord(this.authUser.driver).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          this.authService.addUserToLocalCache(this.authUser);
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          this.authUser.driver.available=!this.authUser.driver.available;
        }
      )
    );

  }
}
