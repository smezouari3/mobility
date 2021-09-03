import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../service/authentication.service';
import { User } from './../../../model/user';
import { TransactionService } from './../../../service/transaction.service';
import { Component, OnInit } from '@angular/core';
import { RequestTransaction } from 'src/app/model/requestTransaction';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
@Component({
  selector: 'app-request-transaction-list',
  templateUrl: './request-transaction-list.component.html',
  styleUrls: ['./request-transaction-list.component.scss']
})
export class RequestTransactionListComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  public transactionMethode = [
    { value: "Cash", label: "Cash" },
    { value: "Compte bancaire", label: "Compte bancaire" },
    { value: "Paypal", label: "Paypal" },
  ];

  selectedTransactionMethode:string;

  authUser:User;
  users:User[];
  transactions:RequestTransaction[];
  selectedTransactions:RequestTransaction[];
  loading=true;
  montant:number=0;
  montantRetrait:number=0;

  drivers:User[];
  dropDrivers=[];
  selectedDriver:User;

  constructor(private router:Router, private transactionService:TransactionService, private authService:AuthenticationService,private modalService:NgbModal, private userService:UserService) {

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
    await this.loadData();

    console.log(this.transactions);
  }

  async loadData(){
    const res:any=await this.transactionService.getRequestTransactions().toPromise();
    this.transactions=res;

    const res2:any=await this.userService.getUsersByRole("ROLE_DRIVER").toPromise();
    this.users=res2;

    this.drivers=this.users;

    for(let driver of this.users){
      let name=driver.firstName+" "+driver.lastName+'('+driver.email+')';
      this.dropDrivers.push({value:driver.id,label:name});
    }

    for(let transaction of this.transactions){
      transaction.userTransaction=this.users.find(w=>w.id==transaction.userId);
    }

    this.transactions=this.transactions.sort((x, y) => +new Date(y.dateTimeTransaction) - +new Date(x.dateTimeTransaction));

    this.loading=false;
  }
  redirect(record:RequestTransaction){
    this.router.navigateByUrl("/dashboard/user/"+record.userTransaction.id);
  }

  public Accept(record:RequestTransaction) {
    swalWithBootstrapButtons.fire({
      title: 'Accepter',
      text: "Confirmez vous votre choix ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        const formData = new FormData();
        formData.append('userId', record.userId.toString());
        formData.append('requestTransactionId', record.id.toString());
        this.subscriptions.push(
          this.transactionService.accept(formData).subscribe(
            (response: CustomHttpRespone)=>{
              swalWithBootstrapButtons.fire(
                'Accepter',
                "La demande est acceptée",
                'success'
              )
            }
          )
        )

      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Erreur',
          'Réessayer ultérieurement',
          'error'
        )
      }
    });
  }

  public Refuse(record:RequestTransaction) {
    swalWithBootstrapButtons.fire({
      title: 'Refuser la transaction',
      text: "Confirmez vous votre choix ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        const formData = new FormData();
        formData.append('userId', record.userId.toString());
        formData.append('requestTransactionId', record.id.toString());
        this.subscriptions.push(
          this.transactionService.refuse(formData).subscribe(
            (response: CustomHttpRespone)=>{
              swalWithBootstrapButtons.fire(
                'Succses',
                "La demande est refusée",
                'success'
              )
            }
          )
        )

      } else if ( result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Erreur',
          'Réessayer ultérieurement',
          'error'
        )
      }
    });
  }

  submitResult3(){
    if(!this.selectedDriver){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "S'il vous plaît choisir un client",
      })
    }else{
      console.log(this.selectedDriver);
      this.selectedDriver=this.drivers.find(w=>w.id==this.selectedDriver["value"]);
      console.log(this.selectedDriver);
      if(this.selectedTransactionMethode){
        if(this.montantRetrait>0){
          if(this.montantRetrait<this.selectedDriver.profit){
            swalWithBootstrapButtons.fire({
              title: 'Vous êtes sur?',
              text: "voulez vous effectuer ce retrait?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Confirmer',
              cancelButtonText: 'Non, Annuler!',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {

                let request:RequestTransaction=new RequestTransaction();
                request.amount=this.montantRetrait
                request.userId=this.selectedDriver.id;
                request.statutTransaction="En attent";
                request.transactionType=this.selectedTransactionMethode['value'];
                console.log(this.selectedTransactionMethode);
                console.log(request);

                 this.subscriptions.push(
                  this.transactionService.add(request).subscribe(
                    async (response:CustomHttpRespone)=>{
                      swalWithBootstrapButtons.fire(
                        'Succès',
                        response.message,
                        'success'
                      )
                      await this.loadData();
                      console.log("success");
                      console.log(response);
                    },
                    (errorResponse: HttpErrorResponse) => {
                      swalWithBootstrapButtons.fire(
                        'Cancelled',
                        errorResponse.error.message,
                        'error'
                      )
                    }
                  ));
              }
            });
          }else{
            swalWithBootstrapButtons.fire(
              'Cancelled',
              "Operation refusée : Solde insuffisant",
              'error'
            )
          }
        }else{
          swalWithBootstrapButtons.fire(
            'Cancelled',
            "Montant invalide",
            'error'
          )
        }
      }
    }


  }

  open(demande) {
    this.modalService.open(demande, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

}
