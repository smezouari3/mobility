import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AuthorisationService } from 'src/app/service/authorisation.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public dialogVisible: boolean;


  constructor(config: NgbModalConfig, private router: Router, private modalService: NgbModal, private authorisationService:AuthorisationService, private authenticationService:AuthenticationService) {
  }

  ngOnInit(): void {
    // this.authenticationService.logOut();
    if (!this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/login');
    }else{
      if(!this.authorisationService.isAdmin){
        this.router.navigateByUrl('/error401');
      }
    }
  }

  showDialog() {
    this.dialogVisible = true;
  }

}
