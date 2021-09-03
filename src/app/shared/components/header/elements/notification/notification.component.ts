import { CustomHttpRespone } from './../../../../../model/custom-http-response';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../../../../service/notification.service';
import { Subscription } from 'rxjs';
import { User } from './../../../../../model/user';
import { Notification } from './../../../../../model/notification';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../../../service/authentication.service';
import { WebSocketService } from './../../../../../service/web-socket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  authUser:User;
  notifications:Notification[]=[];
  userNotifications=[];
  count=0;

  public openNotification: boolean = false;

  constructor(private webSocketService: WebSocketService, private authService:AuthenticationService, public router:Router, public notificationService:NotificationService) {
    this.authUser=this.authService.getUserFromLocalCache();
    let stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
        stompClient.subscribe('/topic/notification', notifications => {
          console.log("I'm in  NOTIFICATION");
          console.log(JSON.parse(notifications.body));
          this.notifications = JSON.parse(notifications.body).notifications;
          if(this.notifications!=null){
            this.notifications=this.notifications.sort((x, y) => +new Date(y.dateTimeBooking) - +new Date(x.dateTimeBooking));
            this.userNotifications=this.notifications.filter(x=>x.userId==this.authUser.id);
            this.count=this.userNotifications.length;
          }
        })
    });
  }

  async ngOnInit() {
    const res1:any=await this.notificationService.getNotifications().toPromise();
    this.notifications=res1;

    this.notifications=this.notifications.sort((x, y) => +new Date(y.dateTimeBooking) - +new Date(x.dateTimeBooking));
    this.userNotifications=this.notifications.filter(x=>x.userId==this.authUser.id);
    this.count=this.userNotifications.length;

    // this.subscriptions.push(
    //   this.notificationService.getNotifications().subscribe(
    //     (response: Notification[]) => {
    //       this.notifications = response;
    //       this.userNotifications=this.notifications.filter(x=>x.userId==this.authUser.id);
    //       this.count=this.userNotifications.length;
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log(errorResponse);
    //     }
    //   )
    // );
  }

  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

  ShowContent(ordre:any,id:any){
    this.subscriptions.push(
      this.notificationService.deleteNotification(id).subscribe(
        (response: CustomHttpRespone) => {
          this.toggleNotificationMobile();
          if(this.authUser.role=="ROLE_DRIVER"){
            this.router.navigateByUrl(ordre);
          }else{
            this.router.navigateByUrl(ordre);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }
  clearAll(){
    this.subscriptions.push(
      this.notificationService.deleteUserNotification(this.authUser.id).subscribe(
        (response: CustomHttpRespone) => {
          this.toggleNotificationMobile();
          console.log(response);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );  }
}
