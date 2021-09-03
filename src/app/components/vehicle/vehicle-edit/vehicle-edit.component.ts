import { DriverService } from './../../../service/driver.service';
import { Driver } from './../../../model/driver';
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
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit {


  public record=new Vehicle();
  public vehicleTypes:any[]=[];
  public drivers:any[]=[];
  private currentId:number;

  private subscriptions: Subscription[] = [];

  public validate = false;
  public tooltipValidation = false;
  public selectedRole:String='';
  public fileStatus = new FileUploadStatus();
  public profileImage: File;

  types: any[] = [];
  users: any[] = [];



  constructor(private authenticationService:AuthenticationService, private service:VehicleService, private driverService:DriverService, private vehicleTypeService:VehicleTypeService,private userService:UserService, private router:Router, private notificationService:NotificationsService) { }

  async ngOnInit() {
    if(this.service.getRecord()){
      this.record=this.service.getRecord();
      this.currentId=this.record.id;
      console.log(this.record);
      this.types=this.vehicleTypeService.getList();
      this.users=this.userService.getList();
    }
    else{
      this.record=new Vehicle();
      this.router.navigateByUrl("/dashboard/vehicle");
    }

    const res1:any=await this.vehicleTypeService.getRecords().toPromise();
    this.types=res1;
    console.log(this.types);

    const res2:any=await this.userService.getUsers().toPromise();
    let usrs:User[]=res2;

    const res3:any=await this.driverService.getDrivers().toPromise();
    let drv:Driver[]=res3;

    for(let driver of drv){
      let user:User=usrs.find(x=>x.id==driver.userId);
      let obj = {key:driver.id,value:user.firstName+" "+user.lastName};
      this.users.push(obj);
    }

    // this.subscriptions.push(
    //   this.vehicleTypeService.getRecords().subscribe(
    //     (response: VehicleType[]) => {
    //       for(let i = 0; i < response.length; i++) {
    //         let obj = {key:response[i].id,value:response[i].name};
    //         this.types.push(obj);
    //       }
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log("error");
    //       console.log(errorResponse);
    //     }
    //   )
    // );
    // this.subscriptions.push(
    //   this.userService.getUsers().subscribe(
    //     (response: User[]) => {
    //       for(let i = 0; i < response.length; i++) {
    //         let obj = {key:response[i].id,value:response[i].firstName+" "+response[i].lastName};
    //         this.users.push(obj);
    //       }
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log("error");
    //       console.log(errorResponse);
    //     }
    //   )
    // );
  }

  loadVehicleType(event){
    this.vehicleTypes=this.types;
  }

  loadDriver(event){
    this.drivers=this.users;
  }

  public submit(): void {
    console.log(this.record);
    this.subscriptions.push(
      this.service.updatRecord(this.record).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          this.notifier_success('Succes','Modifier avec succès');
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard/vehicle');
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
