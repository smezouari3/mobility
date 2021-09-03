import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { VehicleCategory } from 'src/app/model/vehicleCategory';
import { MessageService } from 'src/app/service/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import Swal from 'sweetalert2'
import { VehicleCategoryService } from 'src/app/service/vehicle-category.service';
import { NotificationsService } from 'angular2-notifications';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-vehicle-category-list',
  templateUrl: './vehicle-category-list.component.html',
  styleUrls: ['./vehicle-category-list.component.scss']
})
export class VehicleCategoryListComponent implements OnInit {

  public records: VehicleCategory[];
  selectedRecords: VehicleCategory[];
  public recordEdit = new VehicleCategory();
  loading: boolean = true;
  public record: VehicleCategory= new VehicleCategory();
  public refreshing: boolean;
  public selectedRecord: VehicleCategory;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  public validate = false;
  public tooltipValidation = false;


  cols: any[];
  exportColumns: any[];
  recordDialog: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private service: VehicleCategoryService, private confirmationService: ConfirmationService,private modalService: NgbModal, private messageService: MessageService, private notificationService:NotificationsService) {}

  ngOnInit(): void {
  // this.record = this.authenticationService.getUserFromLocalCache();
    this.getRecords();
  //   this.cols = [
  //     { field: 'userId', header: 'ID' },
  //     { field: 'firstName', header: 'First Name' },
  //     { field: 'lastName', header: 'last Name' },
  //     { field: 'email', header: 'Email' },
  //     { field: 'joinDate', header: 'Date' }
  //   ];

  //   this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }


  public getRecords(): void {
    // this.refreshing = true;
    this.subscriptions.push(
      this.service.getRecords().subscribe(
        (response: VehicleCategory[]) => {
          console.log(response);
          this.service.addRecordsToLocalCache(response);
          this.records = response;
          this.refreshing = false;
          this.loading=false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.refreshing = false;
        }
      )
    );

  }

  public editRecord(record: VehicleCategory){
    this.recordEdit=record;
    // this.service.setRecord(record);
    // this.router.navigateByUrl('/vehicle-categories/edit');
  }

  public deleteRecord(record: VehicleCategory) {
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
              swalWithBootstrapButtons.fire(
                'Supprimer!',
                'La catégorie est supprimée',
                'success'
              )
              this.getRecords();
            },
            (errorResponse: HttpErrorResponse) => {
              console.log(errorResponse);
              swalWithBootstrapButtons.fire(
                'Cancelled',
                errorResponse.error.message,
                'error'
              )
            }
          ));

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
    message=(this.record.name.trim()=='') ? 'Nom est obligatoire' : '';
    console.log(message);
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
    console.log(this.record);
    let message="";
    message=(this.recordEdit.name.trim()=='') ? 'Nom est obligatoire' : '';
    console.log(message);
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
            'La category de la ville ajouté avec succès.',
            'success'
          );
          this.getRecords();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      ));
  }

  edit(){
    const formData = this.service.createRecordFormData(this.recordEdit.id, this.recordEdit);

    this.subscriptions.push(
      this.service.updatRecord(formData).subscribe(
        (response:VehicleCategory)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Modifier',
            'La category de la ville modifié avec succès.',
            'success'
          );
          this.getRecords();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      )
    );
  }

}
