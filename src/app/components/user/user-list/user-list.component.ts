import { CustomHttpRespone } from './../../../model/custom-http-response';
import { Role } from './../../../enum/role.enum';
import { MessageService } from '../../../service/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from './../../../service/user.service';
import { AuthenticationService } from './../../../service/authentication.service';
import { Router } from '@angular/router';
import { User } from './../../../model/user';
import { Component, OnInit, Output } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import Swal from 'sweetalert2'


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public users: User[];
  selectedUsers: User[];
  loading: boolean = true;
  public user: User;
  private subscriptions: Subscription[] = [];

  cols: any[];
  exportColumns: any[];
  recordDialog: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
  this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
    this.cols = [
      { field: 'userId', header: 'ID' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'last Name' },
      { field: 'email', header: 'Email' },
      { field: 'joinDate', header: 'Date' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }


  public getUsers(showNotification: boolean): void {
    // this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.loading=false;
          if (showNotification) {
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );

  }

  public editRecord(user: User){
    this.recordDialog=true;
    this.userService.setUser(user);
    this.router.navigateByUrl('/dashboard/users/edit');
  }








  // ***********************************************************
  public deleteRecord(user:User) {
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
          this.userService.deleteUser(user.username).subscribe(
            (response: CustomHttpRespone)=>{
              swalWithBootstrapButtons.fire(
                'Supprimer!',
                "L'utilisateur est supprimer.",
                'success'
              )
            }
          )
        )

      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Annuler',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });
  }

}
