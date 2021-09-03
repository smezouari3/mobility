import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AuthorisationService } from 'src/app/service/authorisation.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {

  constructor(config: NgbModalConfig, private router: Router, private modalService: NgbModal, private authorisationService:AuthorisationService, private authenticationService:AuthenticationService) {
  }

  ngOnInit(): void {
    if(!this.authorisationService.isAdmin){
      this.router.navigateByUrl('/error401');
    }
  }

}
