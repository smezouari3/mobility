import { City } from './../../../model/city';
import { CityService } from './../../../service/city.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { Subscription } from 'rxjs';
import { Driver } from './../../../model/driver';
import { User } from './../../../model/user';
import { UserService } from './../../../service/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../service/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTypeService } from './../../../service/vehicle-type.service';
import { DriverService } from './../../../service/driver.service';
import { WebSocketService } from './../../../service/web-socket.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';
import { Vehicle } from 'src/app/model/vehicle';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

@Component({
  selector: 'app-list-of-user',
  templateUrl: './list-of-user.component.html',
  styleUrls: ['./list-of-user.component.scss']
})
export class ListOfUserComponent implements OnInit {

  authUser:User;
  user:User=new User();
  users:User[];
  filtredUsers:User[];
  data=[];
  filtredData=[];
  cities:City[]=[];
  private subscriptions: Subscription[] = [];
  city_id=0;
  city=0;
  cityList=[];


  driver:Driver;
  driverAdd:Driver=new Driver();
  role:string="All";
  placesText:string="";

  currentPage=1;
  selectedSize=10;

  public roles=[
    {key:"ROLE_SUPER_ADMIN",value:"SUPER ADMIN"},
    {key:"ROLE_ADMIN",value:"ADMIN"},
    {key:"ROLE_MANAGER",value:"MANAGER"},
    {key:"ROLE_USER",value:"USER"},
    {key:"ROLE_DRIVER",value:"DRIVER"},
    {key:"ROLE_HR",value:"HR"},
  ];

  public host = environment.apiUrl;


  constructor(private webSocketService: WebSocketService, private cityService:CityService, private driverService:DriverService, private userService:UserService,private vehicleTypeService:VehicleTypeService, private modalService: NgbModal, private authService:AuthenticationService, public router:Router) {
    if(this.authService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authService.getUserFromLocalCache();
      if(this.authUser.role=="ROLE_USER" || this.authUser.role=="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }
    }
  }

  async ngOnInit() {
    const res:any=await this.userService.getUsers().toPromise();
    this.users=res;

    this.users=this.users.sort((x, y) => +new Date(y.joinDate) - +new Date(x.joinDate));

    const resx:any=await this.cityService.getRecords().toPromise();
    this.cities=resx;

    for(let ct of this.cities){
      this.cityList.push({key:ct.id,value:ct.name});
    }

    this.filtredUsers=this.users;
    console.log(this.filtredUsers);

    await this.getData();
    this.filtredData=this.data;


  }

  filterRole(role:string){
    this.role=role;
    if(role!='All'){
      this.filtredUsers=this.users.filter(bk=>bk.role==role);
    }else{
      this.filtredUsers=this.users;
    }
    this.getData();
  }

  filter() {
    this.filtredData=this.data.filter(
      u=>u.user.firstName.toLowerCase().includes(this.placesText.toLowerCase()) ||
      u.user.lastName.toLowerCase().includes(this.placesText.toLowerCase()) ||
      u.user.email.toLowerCase().includes(this.placesText.toLowerCase()) ||
      u.user.username.toLowerCase().includes(this.placesText.toLowerCase()) ||
      u.user.phone.toLowerCase().includes(this.placesText.toLowerCase())
    );
    console.log(this.data);
  }

  async getData(){
    this.data=[];
    for(let user of this.filtredUsers){
      this.driver=new Driver();
      this.driver.vehicle=new Vehicle();
      if(user.driver!=null){
        this.driver=user.driver;
      }
      let obj={"user":user,"driver":this.driver};
      this.data.push(obj);
    }
    this.filtredData=this.data;
    console.log(this.filtredData.length);
  }

  clear(){
    this.placesText='';
    this.role='All';
    this.filterRole(this.role);
  }

  redirect(userId){
    this.router.navigateByUrl("/dashboard/user/"+userId);
  }

  open(add) {
    this.modalService.open(add, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  submitAdd(){
    console.log(this.user);
    let message="";
    message=(this.user.lastName.trim()=='') ? 'Le nom est obligatoire' : (
            (this.user.firstName.trim()=='') ? 'Le prenom est obligatoire' : (
            (this.user.username.trim()=='') ? 'Le nom d\'utilisateur est obligatoire' : (
            (this.user.email.trim()=='') ? 'L\'email est obligatoire' : (
            (this.user.phone.trim()=='') ? 'Le N° de telephone est obligatoire' : (
            (this.user.role.trim()=='') ? 'Le role est obligatoire' : '')))));

    if(this.user.role=='ROLE_DRIVER'){
      if(this.city==0){
        message='La ville est obligatoire';
      }
    }
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
    console.log(this.city);
    this.subscriptions.push(
      this.userService.addUser(this.user,this.city).subscribe(
        (response: CustomHttpRespone) => {
          console.log("success");
          console.log(response);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:"L'utilisateur est ajouté avec succès et le mot de passe envoyer par email",
            showConfirmButton: false,
            timer: 2000
          });
          this.getData();
          // this.user=null;
          // this.clickButton('closeEditUserModalButton');
          // this.getUsers(false);
          // this.fileName = null;
          // this.profileImage = null;
          // this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("error");
          console.log(errorResponse);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+errorResponse.error.message+'</b>',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
      );
  }

}
