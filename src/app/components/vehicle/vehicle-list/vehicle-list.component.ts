import { Driver } from './../../../model/driver';
import { DriverService } from './../../../service/driver.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { VehicleType } from './../../../model/vehicleType';
import { UserService } from 'src/app/service/user.service';
import { VehicleTypeService } from 'src/app/service/vehicle-type.service';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { MessageService } from './../../../service/message.service';
import { ConfirmationService } from './../../../service/confirmation.service';
import { VehicleService } from './../../../service/vehicle.service';
import { AuthenticationService } from './../../../service/authentication.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { Subscription } from 'rxjs';
import { Vehicle } from 'src/app/model/Vehicle';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {


  public records: Vehicle[];
  selectedRecords: Vehicle[];
  public recordEdit = new Vehicle();
  loading: boolean = true;
  public record: Vehicle=new Vehicle();
  public refreshing: boolean;
  public selectedRecord: Vehicle;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  public validate = false;
  public tooltipValidation = false;
  types: any[] = [];
  drivers: any[] = [];
  users:any[]=[];
  IsmodelShow;



  constructor(private router: Router, private authenticationService: AuthenticationService,
              private service: VehicleService,private vehicleTypeService:VehicleTypeService,private DriverService:DriverService, private modalService: NgbModal, private userService:UserService, private confirmationService: ConfirmationService, private messageService: MessageService, private notificationService:NotificationsService) {}

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
    await this.getRecords();
  }


  public async getRecords(){

    const res1:any=await this.service.getRecords().toPromise();
    this.records=res1;
    this.service.addRecordsToLocalCache(this.records);
    console.log(this.records);
    this.loading=false;

    // this.subscriptions.push(
    //   this.service.getRecords().subscribe(
    //     (response: Vehicle[]) => {
    //       this.service.addRecordsToLocalCache(response);
    //       this.records = response;
    //       this.refreshing = false;
    //       this.loading=false;
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       this.refreshing = false;
    //     }
    //   )
    // );

  }

  redirect(record:Vehicle){
    this.router.navigateByUrl("/dashboard/user/"+record.vehicleDriver.userId);
  }

  public editRecord(record: Vehicle){
    this.recordEdit=record;
    // this.service.setRecord(record);
    // this.router.navigateByUrl('/dashboard/vehicle/edit');
  }

  public deleteRecord(record: Vehicle) {
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.push(
          this.service.deleteRecord(record.id).subscribe(
            (response:CustomHttpRespone)=>{
              console.log("success");
              console.log(response);
              // this.getRecords();
              // this.router.navigateByUrl('/vehicle-categories/add');
              // setTimeout(() => {
              //   this.router.navigateByUrl('/vehicle-categories');
              // }, 2500);
            },
            (errorResponse: HttpErrorResponse) => {
              this.notifier_error('Error',errorResponse.error.message);
            }
          ));
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });
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

  public submit() {
    this.validate = !this.validate;
  }
  public tooltipSubmit() {
    this.tooltipValidation = !this.tooltipValidation;
  }




  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }


  submitAdd(){
    console.log(this.record);
    let message="";
    message=(this.record.matricule.trim()=='') ? 'Matricule est obligatoire' : (
            (this.record.brandName.trim()=='') ? 'La marque est obligatoire' : (
            (this.record.vehicleName.trim()=='') ? 'Le modele est obligatoire' : (
            (this.record.vehicleColor.trim()=='') ? 'La couleur est obligatoire' : (
            (this.record.vehicle_type_id==0) ? 'Le type est obligatoire' : (
            (this.record.driverId==0) ? 'Le chauffeur est obligatoire' : '')))));
    console.log(message);
    this.IsmodelShow=true;
    if(message==""){
      this.add();
    }else{
      swalWithBootstrapButtons.fire(
        'Form Invalide',
        message,
        'error'
      )
    }
  }

  submitEdit(){
    console.log(this.recordEdit);
    let message="";
    message=(this.recordEdit.matricule.trim()=='') ? 'Matricule est obligatoire' : (
      (this.recordEdit.brandName.trim()=='') ? 'La marque est obligatoire' : (
      (this.recordEdit.vehicleName.trim()=='') ? 'Le modele est obligatoire' : (
      (this.recordEdit.vehicleColor.trim()=='') ? 'La couleur est obligatoire' : (
      (this.recordEdit.vehicle_type_id==0) ? 'Le type est obligatoire' : (
      (this.recordEdit.driverId==0) ? 'Le chauffeur est obligatoire' : '')))));    console.log(message);
    if(message==""){
      this.edit();
    }else{
      swalWithBootstrapButtons.fire(
        'Form Invalide',
        message,
        'error'
      )
    }
  }

  add(){
    this.subscriptions.push(
      this.service.addRecord(this.record).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Ajouter',
            'La vehicule ajouter avec succès.',
            'success'
          );
          this.getRecords();
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          swalWithBootstrapButtons.fire(
            'Erreur',
            error.error.message,
            'error'
          );
        }
      )
    );
  }

  edit(){
    this.subscriptions.push(
      this.service.updatRecord(this.recordEdit).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Modifier',
            'La vehicule modifier avec succès.',
            'success'
          );
          this.getRecords()
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          swalWithBootstrapButtons.fire(
            'Erreur',
            error.error.message,
            'error'
          );
        }
      )
    );
  }

}
