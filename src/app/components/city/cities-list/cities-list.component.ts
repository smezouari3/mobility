import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { CityService } from './../../../service/city.service';
import { NotificationsService } from 'angular2-notifications';
import { MessageService } from './../../../service/message.service';
import { ConfirmationService } from './../../../service/confirmation.service';
import { AuthenticationService } from './../../../service/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { City } from './../../../model/city';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit {

  public records: City[];
  selectedRecords: City[];
  public recordEdit = new City();
  loading: boolean = true;
  public record: City=new City();
  public refreshing: boolean;
  public selectedRecord: City;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public validate = false;
  public tooltipValidation = false;


  cols: any[];
  exportColumns: any[];
  recordDialog: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private service: CityService, private confirmationService: ConfirmationService,private modalService: NgbModal, private messageService: MessageService, private notificationService:NotificationsService) {}

  async ngOnInit() {
  // this.record = this.authenticationService.getUserFromLocalCache();
    await this.getRecords();
  //   this.cols = [
  //     { field: 'userId', header: 'ID' },
  //     { field: 'firstName', header: 'First Name' },
  //     { field: 'lastName', header: 'last Name' },
  //     { field: 'email', header: 'Email' },
  //     { field: 'joinDate', header: 'Date' }
  //   ];

  //   this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }


  public async getRecords() {

    const res1:any=await this.service.getRecords().toPromise();
    this.records=res1;
    console.log(this.records);
    this.loading=false;

  }

  public editRecord(record: City){
    this.recordEdit=record;
  }

  public deleteRecord(record: City) {
    swalWithBootstrapButtons.fire({
      title: 'Supprimer',
      text: "Vous ne pouvez pas récupérer ces données",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.push(
          this.service.deleteRecord(record.id).subscribe(
            (response:CustomHttpRespone)=>{
              console.log("success");
              console.log(response);
              this.getRecords();
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
    message=(this.record.name.trim()=='') ? 'Nom est obligatoire' : (this.record.tag.trim()=='' ? 'Tag est obligatoire' : '');
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
    message=(this.recordEdit.name.trim()=='') ? 'Nom est obligatoire' : (this.recordEdit.tag.trim()=='' ? 'Tag est obligatoire' : '');
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
            'La ville ajouté avec succès.',
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
    this.subscriptions.push(
      this.service.updatRecord(this.recordEdit).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Modifier',
            'La ville Modifié avec succès.',
            'success'
          );
          this.getRecords();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notifier_error('Error',errorResponse.error.message);
        }
      ));
  }


}
