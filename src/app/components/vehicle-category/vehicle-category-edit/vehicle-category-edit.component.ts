import { VehicleCategoryService } from 'src/app/service/vehicle-category.service';
import { VehicleCategory } from './../../../model/vehicleCategory';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-vehicle-category-edit',
  templateUrl: './vehicle-category-edit.component.html',
  styleUrls: ['./vehicle-category-edit.component.scss']
})
export class VehicleCategoryEditComponent implements OnInit {
  @Input() record: VehicleCategory;
  public validate = false;
  private subscriptions: Subscription[] = [];


  currentId:number;


  constructor(private service:VehicleCategoryService, private router:Router, private notificationService:NotificationsService) { }

  ngOnInit(): void {
    if(this.service.getRecord()){
      this.record=this.service.getRecord();
      this.currentId=this.record.id;
      console.log(this.record);
    }
    else{
      this.record=new VehicleCategory();
      this.router.navigateByUrl("/vehicle-categories");
    }
  }

  public submit() {
    this.validate = !this.validate;
    const formData = this.service.createRecordFormData(this.currentId, this.record);
    this.subscriptions.push(
      this.service.updatRecord(formData).subscribe(
        (response:VehicleCategory)=>{
          console.log("success");
          console.log(response);
          this.notifier_success('Succes','Modifier avec succès');
          setTimeout(() => {
            this.router.navigateByUrl('/vehicle-categories');
          }, 2500);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      )
    );
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
