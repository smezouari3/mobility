import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AuthorisationService } from 'src/app/service/authorisation.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  constructor(config: NgbModalConfig, private router: Router, private modalService: NgbModal, private authorisationService:AuthorisationService, private authenticationService:AuthenticationService) {
  }
  ngOnInit(): void {
    if(!this.authorisationService.isAdmin){
      this.router.navigateByUrl('/error401');
    }
  }

}
