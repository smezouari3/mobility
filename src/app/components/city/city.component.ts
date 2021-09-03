import { AuthenticationService } from './../../service/authentication.service';
import { AuthorisationService } from './../../service/authorisation.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  public dialogVisible: boolean;

  //tst

  constructor(config: NgbModalConfig, private router: Router, private modalService: NgbModal, private authorisationService:AuthorisationService, private authenticationService:AuthenticationService) {
  }

  ngOnInit(): void {
    if(!this.authorisationService.isAdmin){
      this.router.navigateByUrl('/error401');
    }
  }

  showDialog() {
    this.dialogVisible = true;
  }

}
