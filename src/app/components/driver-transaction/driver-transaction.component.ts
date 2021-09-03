import { Router } from '@angular/router';
import { RequestTransaction } from './../../model/requestTransaction';
import { TransactionService } from './../../service/transaction.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wallet } from './../../model/wallet';
import { User } from 'src/app/model/user';
import { WalletService } from './../../service/wallet.service';
import { UserService } from './../../service/user.service';
import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

@Component({
  selector: 'app-driver-transaction',
  templateUrl: './driver-transaction.component.html',
  styleUrls: ['./driver-transaction.component.scss']
})
export class DriverTransactionComponent implements OnInit {


  authUser:User;
  transactions:RequestTransaction[];
  filtredTransactions:RequestTransaction[];

  montantRetrait:number=0;

  public host = environment.apiUrl;
  private subscriptions: Subscription[] = [];


  public periode = [
    { value: "2629800000", label: "1 Mois" },
    { value: "7889400000", label: "3 Mois" },
    { value: "15778800000", label: "6 Mois" },
    { value: "31557600000", label: "12 Mois" },
    { value: "all", label: "Tous" },
  ];

  public transactionMethode = [
    { value: "Cash", label: "Cash" },
    { value: "Compte bancaire", label: "Compte bancaire" },
    { value: "Paypal", label: "Paypal" },
  ];

  selectedTransactionMethode:string;
  selectedPeriode={ value: "2629800000", label: "1 Mois" };

  showSend:boolean=true;
  showAdd:boolean=true;


  constructor(private authenticationService:AuthenticationService,private router:Router, private transactionService:TransactionService, private userService:UserService, private modalService:NgbModal, private walletService:WalletService) {
    if(this.authenticationService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }else{
      this.authUser=this.authenticationService.getUserFromLocalCache();
      if(this.authUser.role!="ROLE_DRIVER"){
        this.router.navigateByUrl('/login');
      }
    }

   }

  async ngOnInit(){
    await this.loadTransactions();
  }

  async loadTransactions(){

    let resUser:any=await this.userService.userGet(this.authUser.id).toPromise();
    this.authUser=resUser;

    let res:any= await this.transactionService.getUserRequestTransactions(this.authUser.id).toPromise();
    this.transactions=res;

    this.transactions=this.transactions.sort((x, y) => +new Date(y.dateTimeTransaction) - +new Date(x.dateTimeTransaction));

    var time = new Date().getTime() - 2629800000;
    this.filtredTransactions=this.transactions.filter(
      (w)=>{
        var date = new Date(w.dateTimeTransaction); // some mock date
        var milliseconds = date.getTime();
        if(milliseconds>time){
          return true;
        }

      });

  }

  changePeriode(event:any){
    if(this.selectedPeriode){
      if(this.selectedPeriode["value"]!="all"){
        let periodeMilliSeconde=+this.selectedPeriode["value"];
        var time = new Date().getTime() - periodeMilliSeconde;
        this.filtredTransactions=this.transactions.filter(
          (w)=>{
            var date = new Date(w.dateTimeTransaction); // some mock date
            var milliseconds = date.getTime();
            if(milliseconds>time){
              return true;
            }

          });
      }else{
        this.filtredTransactions=this.transactions;
      }
    }

  }

  submitResult3(){
    if(this.selectedTransactionMethode){
      if(this.montantRetrait>0){
        if(this.montantRetrait<this.authUser.profit){
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
              request.userId=this.authUser.id;
              request.statutTransaction="En attent";
              request.transactionType=this.selectedTransactionMethode

               this.subscriptions.push(
                this.transactionService.add(request).subscribe(
                  async (response:CustomHttpRespone)=>{
                    swalWithBootstrapButtons.fire(
                      'Succès',
                      response.message,
                      'success'
                    )
                    await this.loadTransactions();
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

  CancelTransaction(transaction:RequestTransaction){
    if(transaction.statutTransaction=="En attent"){
      swalWithBootstrapButtons.fire({
        title: 'Vous êtes sur?',
        text: "voulez vous annuler ce retrait?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Non, Annuler!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          transaction.statutTransaction="Annuler";
            this.subscriptions.push(
            this.transactionService.update(transaction).subscribe(
              async (response:CustomHttpRespone)=>{
                swalWithBootstrapButtons.fire(
                  'Succès',
                  response.message,
                  'success'
                )
                await this.loadTransactions();
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
    }
  }

  openDemande(demande) {
    this.modalService.open(demande, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

}
