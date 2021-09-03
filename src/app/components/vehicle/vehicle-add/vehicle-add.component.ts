import { Driver } from './../../../model/driver';
import { DriverService } from './../../../service/driver.service';
import { UserService } from './../../../service/user.service';
import { VehicleTypeService } from './../../../service/vehicle-type.service';
import { Vehicle } from 'src/app/model/Vehicle';
import { VehicleCategory } from 'src/app/model/vehicleCategory';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import { VehicleService } from 'src/app/service/vehicle.service';
import { VehicleCategoryService } from 'src/app/service/vehicle-category.service';
import { VehicleType } from 'src/app/model/vehicleType';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.scss']
})
export class VehicleAddComponent implements OnInit {


  public record=new Vehicle();
  public vehicleTypes:any[]=[];
  public drivers:any[]=[];

  private subscriptions: Subscription[] = [];

  public validate = false;
  public tooltipValidation = false;
  public selectedRole:String='';
  public fileStatus = new FileUploadStatus();
  public profileImage: File;

  types: any[] = [];
  users: any[] = [];



  constructor(private authenticationService:AuthenticationService,private DriverService:DriverService, private service:VehicleService, private vehicleTypeService:VehicleTypeService,private userService:UserService, private router:Router, private notificationService:NotificationsService) { }

  async ngOnInit() {
    const res1:any=await this.vehicleTypeService.getRecords().toPromise();
    this.types=res1;
    console.log(this.types);

    const res2:any=await this.userService.getUsers().toPromise();
    let usrs:User[]=res2;

    const res3:any=await this.DriverService.getDrivers().toPromise();
    let drv:Driver[]=res3;

    for(let driver of drv){
      let user:User=usrs.find(x=>x.id==driver.userId);
      let obj = {key:driver.id,value:user.firstName+" "+user.lastName};
      this.users.push(obj);
    }
  }

  loadVehicleType(event){
    this.vehicleTypes=this.types;
  }

  loadDriver(event){
    this.drivers=this.users;
  }

  public submit(): void {
    this.subscriptions.push(
      this.service.addRecord(this.record).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          this.notifier_success('Succes','Ajouter avec succès');
          setTimeout(() => {
            this.router.navigateByUrl('/vehicle');
          }, 2500);
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          this.notifier_error('Error',error.error.message);
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
