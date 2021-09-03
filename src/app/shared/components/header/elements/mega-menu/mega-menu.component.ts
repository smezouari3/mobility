import { Router } from '@angular/router';
import { DriverService } from './../../../../../service/driver.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/user';
import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../../../services/nav.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


import { LocalisationService } from 'src/app/service/localisation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss']
})
export class MegaMenuComponent implements OnInit {

  public megaItems: Menu[];
  public levelmenuitems: Menu[];

  public host = "http://localhost:8081";

  private subscriptions: Subscription[] = [];
  public menu=false;
  authUser:User;
  logged:boolean=false;
  locationWatchId: number;

  position: google.maps.LatLngLiteral;


  constructor(public navServices: NavService,private authService:AuthenticationService,private driverService:DriverService,private localisationService:LocalisationService, private router:Router) {
    this.navServices.megaItems.subscribe(megaItems => this.megaItems = megaItems);
    this.navServices.levelmenuitems.subscribe(levelmenuitems => this.levelmenuitems = levelmenuitems);
  }

  ngOnInit() {
    this.authUser=this.authService.getUserFromLocalCache();
    console.log(this.authUser);
  }

  megaMenuToggle() {
    this.navServices.levelMenu = false;
    this.navServices.megaMenu  = !this.navServices.megaMenu;
    if(window.innerWidth < 991) {
      this.navServices.collapseSidebar = true;
    }
  }

  levelMenuToggle() {
    this.navServices.megaMenu  = false;
    this.navServices.levelMenu = !this.navServices.levelMenu;
    if(window.innerWidth < 991) {
      this.navServices.collapseSidebar = true;
    }
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.megaItems.forEach(a => {
        if (this.megaItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }


}
