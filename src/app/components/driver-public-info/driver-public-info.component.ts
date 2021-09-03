import { User } from './../../model/user';
import { UserService } from './../../service/user.service';
import { Role } from './../../enum/role.enum';
import { AuthenticationService } from './../../service/authentication.service';
import { Rating } from './../../model/rating';
import { RatingService } from './../../service/rating.service';
import { VehicleTypeService } from './../../service/vehicle-type.service';
import { DriverService } from './../../service/driver.service';
import { VehicleType } from './../../model/vehicleType';
import { Driver } from './../../model/driver';
import { BookingService } from './../../service/booking.service';
import { Booking } from './../../model/booking';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { FileUploadStatus } from './../../model/file-upload.status';
import { HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { USE_STORE } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';
import { PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-driver-public-info',
  templateUrl: './driver-public-info.component.html',
  styleUrls: ['./driver-public-info.component.scss']
})
export class DriverPublicInfoComponent implements OnInit {

  authUser:User;
  user: User;
  bookings:Booking[]=[];
  rat:number=0;
  countRat:number=0;
  id:number=-1;
  public host = environment.apiUrl;
  bookingShow:Booking[]=[];
  ratings:Rating[]=[];
  dataRating=[];
  exist=false;

  constructor(private authenticationService:AuthenticationService,private route:ActivatedRoute, private ratingService:RatingService, private driverService:DriverService, private vehicleTypeService:VehicleTypeService, private bookingService:BookingService, private modalService: NgbModal, private userService:UserService, private router:Router, private notificationService:NotificationsService) {
    if(this.authenticationService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authenticationService.getUserFromLocalCache();
      if(this.authUser.role!="ROLE_USER"){
        this.router.navigateByUrl('/login');
      }else{
        this.user=new User();
        this.route.paramMap.subscribe( params => {
          this.id = parseInt(params.get('id'));
        });
      }
    }
  }

  async ngOnInit(){
    const res:any=await this.userService.userGet(this.id).toPromise();
    this.user=res;
    console.log(this.user);
    if(!this.user){
      this.user=new User();
      this.router.navigateByUrl('/error404');
    }else{
      this.exist=false;
      const res2:any =await this.bookingService.getBookings().toPromise();
      this.bookings=res2;
      for(let booking of this.bookings){
        if(booking.status!="En attente"){
          if(this.authUser.id==booking.customerId && booking.driver_id==this.user.driver.id){
            console.log("im in if");
            this.exist=true;
          }
          if(booking.driver_id==this.user.driver.id){
            this.bookingShow.push(booking);
          }
        }
      }
      console.log(this.exist);
      if( this.exist==false){
        this.router.navigateByUrl('/error404');
      }else{
        const res3:any =await this.ratingService.getDrivers().toPromise();
        this.ratings=res3;

        for(let rating of this.ratings){
          if(rating.driverId==this.user.driver.id){
            this.rat=this.rat+rating.rating;
            this.countRat++;
            const res:any=await this.userService.userGet(this.bookings.find(bk=>bk.id==rating.bookingId).customerId).toPromise();
            let obj={"rating":rating,"booking":this.bookings.find(bk=>bk.id==rating.bookingId),"user":res};
            this.dataRating.push(obj);

          }
        }
      }
    }


  }
}
