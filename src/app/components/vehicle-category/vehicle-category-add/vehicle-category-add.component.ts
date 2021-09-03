import { AuthorisationService } from './../../../service/authorisation.service';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { VehicleCategoryService } from 'src/app/service/vehicle-category.service';
import { VehicleCategory } from './../../../model/vehicleCategory';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-category-add',
  templateUrl: './vehicle-category-add.component.html',
  styleUrls: ['./vehicle-category-add.component.scss']
})
export class VehicleCategoryAddComponent implements OnInit {
  record: VehicleCategory;
  public validate = false;
  private subscriptions: Subscription[] = [];


  currentId:number;


  constructor(private service:VehicleCategoryService, private authorisationService:AuthorisationService, private router:Router, private notificationService:NotificationsService) { }

  ngOnInit(): void {
    if(!this.authorisationService.isAdmin){
      this.router.navigateByUrl('/error401');
    }
    this.record=new VehicleCategory();
  }

  public submit() {
    this.validate = !this.validate;
    this.subscriptions.push(
      this.service.addRecord(this.record).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          this.notifier_success('Succes','Modifier avec succès');
          setTimeout(() => {
            this.router.navigateByUrl('/vehicle-categories');
          }, 2100);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      ));
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

  notifier_error(title:string,message:string){
    this.notificationService.error(title,message,{
      position:['top','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

}
