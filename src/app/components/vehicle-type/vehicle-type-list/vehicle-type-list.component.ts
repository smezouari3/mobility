import { CityService } from './../../../service/city.service';
import { City } from './../../../model/city';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleCategory } from './../../../model/vehicleCategory';
import { VehicleCategoryService } from './../../../service/vehicle-category.service';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { VehicleType } from 'src/app/model/VehicleType';
import { MessageService } from 'src/app/service/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import Swal from 'sweetalert2'
import { VehicleTypeService } from 'src/app/service/vehicle-type.service';
import { NotificationsService } from 'angular2-notifications';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

@Component({
  selector: 'app-vehicle-type-list',
  templateUrl: './vehicle-type-list.component.html',
  styleUrls: ['./vehicle-type-list.component.scss']
})
export class VehicleTypeListComponent implements OnInit {

  public records: VehicleType[];
  selectedRecords: VehicleType[];
  public recordEdit = new VehicleType();
  loading: boolean = true;
  public record: VehicleType=new VehicleType();
  public refreshing: boolean;
  public selectedRecord: VehicleType;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  public validate = false;
  public tooltipValidation = false;
  show=false;
  cat: any[] = [];
  public host = environment.apiUrl;

  title = 'ngImageCrop';
  imageChangedEventAdd: any = '';
  croppedImageAdd: any = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  public vehicleCategories:VehicleCategory[]=[];

  selectedCities:any[]=[];
  Cities:any[]=[];
  cities:City[];


  constructor(private router: Router, private authenticationService: AuthenticationService,
              private service: VehicleTypeService, private vehicleCategoryService: VehicleCategoryService, private cityService:CityService, private serviceVehicleCategory:VehicleCategoryService, private modalService: NgbModal, private confirmationService: ConfirmationService, private messageService: MessageService, private notificationService:NotificationsService) {}

  async ngOnInit() {
    const res:any=await this.cityService.getRecords().toPromise();
    this.cities=res;
    for(let city of this.cities){
      this.Cities.push({value:city.id,label:city.name});
    }
    console.log(this.Cities);
    const res2:any=await this.serviceVehicleCategory.getRecords().toPromise();
    this.vehicleCategories=res2;
    this.getRecords();
  }


  public getRecords(): void {
    this.subscriptions.push(
      this.service.getRecords().subscribe(
        (response: VehicleType[]) => {
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

  /****************************************************ADD***********************************************/

  fileChangeEventAdd(event: any): void {
    this.show=true;

    // this.profileImage=event.target.files[0];
    this.imageChangedEventAdd = event;
  }
  imageCroppedAdd(event: ImageCroppedEvent) {
      this.croppedImageAdd = event.base64;
      console.log(this.croppedImageAdd);
  }
  imageLoadedAdd() {
    this.show=true;

      /* show cropper */
  }
  cropperReadyAdd() {
      /* cropper ready */
  }
  loadImageFailedAdd() {
    this.show=false;
    this.notificationService.error('Failed','Failed to load image',{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  submitAdd(){
    console.log(this.record);
    let message="";
    message=(this.record.name.trim()=='') ? 'Nom est obligatoire' : (
      (this.record.tag.trim()=='') ? 'L\'abréviation est obligatoire' : (
      (this.record.tagline.trim()=='') ? 'La description est obligatoire' : (
      (this.record.price==0) ? 'Le prix est obligatoire' : (
      (this.record.point==0) ? 'Le nombre des points est obligatoire' : (
      (this.record.vehicle_category_id==0) ? 'Le Type est obligatoire' : '')))));
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
  add(){
    const formData = new FormData();
    formData.append('name', this.record.name);
    formData.append('tagline', this.record.tagline);
    formData.append('tag', this.record.tag);
    formData.append('price', this.record.price.toString());
    formData.append('point', this.record.point.toString());
    formData.append('vehicleCategoryId', this.record.vehicle_category_id.toString());
    formData.append('enabled', JSON.stringify(this.record.enabled));
    if(this.croppedImageAdd){
      const fileToUpload: File = new File([this.dataURItoBlobAdd(this.croppedImageAdd)], this.record.name+'.png');
      formData.append('picture', fileToUpload);
    }
    this.subscriptions.push(
      this.service.addRecord(formData).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Ajouter',
            'Ajouté avec succès.',
            'success'
          );
          this.getRecords();
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          this.notifier_error('Error',error.error.message);
          swalWithBootstrapButtons.fire(
            'Erreur',
            error.error.message,
            'error'
          );
        }
      )
    );
    // this.subscriptions.push(
    //   this.service.addRecord(this.record).subscribe(
    //     (response:CustomHttpRespone)=>{
    //       console.log("success");
    //       console.log(response);
    //       swalWithBootstrapButtons.fire(
    //         'Ajouter',
    //         'La category de la ville ajouté avec succès.',
    //         'success'
    //       );
    //       this.getRecords();
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       this.notifier_error('Error',errorResponse.error.message);
    //     }
    //   ));
  }
  dataURItoBlobAdd(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  /*************************************************************END ADD****************************************************** */

  public editRecord(record: VehicleType){
    this.recordEdit=record;
    /* this.service.setRecord(record);
    this.subscriptions.push(
      this.vehicleCategoryService.getRecords().subscribe(
        (response: VehicleCategory[]) => {
          for(let i = 0; i < response.length; i++) {
            let obj = {key:response[i].id,value:response[i].name};
            this.cat.push(obj);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("error");
          console.log(errorResponse);
        }
      )
    );
    this.vehicleCategoryService.setList(this.cat);

    this.router.navigateByUrl('/vehicle-type/edit'); */

  }

  public deleteRecord(record: VehicleType) {
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
              swalWithBootstrapButtons.fire(
                'Supprimer!',
                'Le type est supprimée',
                'success'
              )
              // this.getRecords();
            },
            (errorResponse: HttpErrorResponse) => {
              swalWithBootstrapButtons.fire(
                'Erreur',
                errorResponse.error.message,
                'error'
              )
            }
          ));

      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Annuler',
          'L\'operation est annulée',
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



  submitEdit(){
    console.log(this.recordEdit);
    let message="";
    message=(this.recordEdit.name.trim()=='') ? 'Nom est obligatoire' : (
      (this.recordEdit.tag.trim()=='') ? 'L\'abréviation est obligatoire' : (
      (this.recordEdit.tagline.trim()=='') ? 'La description est obligatoire' : (
      (this.recordEdit.price==0) ? 'Le prix est obligatoire' : (
      (this.recordEdit.point==0) ? 'Le nombre des points est obligatoire' : (
      (this.recordEdit.vehicle_category_id==0) ? 'Le Type est obligatoire' : '')))));
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



  edit(){
    console.log(this.recordEdit);
    const formData = new FormData();
    formData.append('id', this.recordEdit.id.toString());
    formData.append('name', this.recordEdit.name);
    formData.append('tagline', this.recordEdit.tagline);
    formData.append('tag', this.recordEdit.tag);
    formData.append('price', this.recordEdit.price.toString());
    formData.append('point', this.recordEdit.point.toString());
    formData.append('vehicleCategoryId', this.recordEdit.vehicle_category_id.toString());
    formData.append('enabled', JSON.stringify(this.recordEdit.enabled));
    if(this.croppedImage){
      const fileToUpload: File = new File([this.dataURItoBlob(this.croppedImage)], this.recordEdit.name+'.png');
      formData.append('picture', fileToUpload);
    }
    this.subscriptions.push(
      this.service.updatRecord(formData).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Modifier',
            'Modifier avec succès.',
            'success'
          );
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          this.notifier_error('Error',error.error.message);
        }
      )
    );
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }



  async updateCities(record:VehicleType){
    this.recordEdit=record;

    this.selectedCities=[];
    for(let city of this.cities.filter(w=>w.vehicleTypes.find(x=>x.id==record.id))){
      this.selectedCities.push({value:city.id,label:city.name});
    }

    /* const res2:any=await this.service.getCitiesOfVehicleType(record.id).toPromise();
    let selectedCities:City[]=res2;
    for(let city of selectedCities){
      this.selectedCities.push({value:city.id,label:city.name});
    } */
    console.log(this.selectedCities);
  }

  submitCities(){
    console.log(this.selectedCities);
    let id:string='';
    for(let city of this.selectedCities){
      id=id+city["value"]+"|";
    }
    id=id.slice(0, -1);
    console.log(id);
    const formData = new FormData();
    formData.append('vid', this.recordEdit.id.toString());
    formData.append('citiesId', id);

    this.subscriptions.push(
      this.service.affect(formData).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          swalWithBootstrapButtons.fire(
            'Modifier',
            'Les villes affecter avec succès.',
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

  fileChangeEvent(event: any): void {
    this.show=true;

    // this.profileImage=event.target.files[0];
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(this.croppedImage);
  }
  imageLoaded() {
    this.show=true;

      /* show cropper */
  }
  cropperReady() {
      /* cropper ready */
  }
  loadImageFailed() {
    this.show=false;
    this.notificationService.error('Failed','Failed to load image',{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }
}
