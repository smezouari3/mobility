import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/authentication.service';
import { WebSocketService } from './../../service/web-socket.service';
import { User } from './../../model/user';
import { Notification } from './../../model/notification';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
// import { NotificationModel } from 'src/app/models/notification';
// import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-real-notification',
  templateUrl: './real-notification.component.html',
  styleUrls: ['./real-notification.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RealNotificationComponent implements OnInit {

  authUser:User;
  notifications=[];
  currentNotification=null;
  // notifications:Notification[]=[];
  // currentNotification:Notification=new Notification();
  count=0;

  showPanel: boolean=false;
  notification: Notification;
  notificationSub: Subscription;
  notificationTimeout: any;

  constructor(private webSocketService: WebSocketService, private authService:AuthenticationService, public router:Router, private notificationService:NotificationService) {
    this.authUser=this.authService.getUserFromLocalCache();
    let stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
        stompClient.subscribe('/topic/notification', notifications => {
          this.notifications = JSON.parse(notifications.body).currentNotifications;
          if(this.notifications){
            this.currentNotification=this.notifications.find(x=>x.userId==this.authUser.id);
            if(this.currentNotification!=null){
              var bleep = new Audio();
              bleep.src = './../assets/sound/Alert_Tone_Sound_Effect.mp3';
              bleep.play();
              this.showPanel=true;
            }
          }
        })
    });
  }
  ngOnInit(): void {

  }

  dismissNotification() {
    this.showPanel = false;
  }

  ngOnDestroy() {
    this.notificationSub.unsubscribe();
    clearTimeout(this.notificationTimeout);
  }

  redirectTo(){
    this.showPanel = false;
    this.router.navigateByUrl(this.currentNotification.content.split('|')[1]);
  }

}
