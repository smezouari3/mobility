import { User } from './../../../../../model/user';
import { AuthenticationService } from './../../../../../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public host = "http://localhost:8081";

  public menu=false;
  authUser:User;

  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
    this.authUser=this.authService.getUserFromLocalCache();
  }


  menuToggle(){
    this.menu=!this.menu;
  }

  logout(){
    this.authService.logOut();
    this.router.navigateByUrl("/login");
  }

}
