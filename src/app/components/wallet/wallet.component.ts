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
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  authUser:User;
  wallets:Wallet[];
  filtredWallets:Wallet[];

  email:string="";
  montant:number=0;
  montantRetrait:number=0;

  public host = "http://localhost:8081";
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


  constructor(private authenticationService:AuthenticationService, private router: Router, private transactionService:TransactionService, private userService:UserService, private modalService:NgbModal, private walletService:WalletService) {
    if(this.authenticationService.isUserLoggedIn()==false){
      this.router.navigateByUrl('/login');
    }
   }

  async ngOnInit(){
    await this.loadWallets();
  }

  async loadWallets(){
    this.authUser=this.authenticationService.getUserFromLocalCache();
    let resUser:any=await this.userService.userGet(this.authUser.id).toPromise();
    this.authUser=resUser;

    let res:any= await this.walletService.getUserWallets(this.authUser.id).toPromise();
    this.wallets=res;

    this.wallets=this.wallets.sort((x, y) => +new Date(y.dateTimeTransaction) - +new Date(x.dateTimeTransaction));

    var time = new Date().getTime() - 2629800000;
    this.filtredWallets=this.wallets.filter(
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
        this.filtredWallets=this.wallets.filter(
          (w)=>{
            var date = new Date(w.dateTimeTransaction); // some mock date
            var milliseconds = date.getTime();
            if(milliseconds>time){
              return true;
            }

          });
      }else{
        this.filtredWallets=this.wallets;
      }
    }

  }

  openSend(send) {
    console.log("im in open")
    this.modalService.open(send, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  submitResult(){
    if(this.email.trim()!='' && this.montant>0){
      if(this.email!=this.authUser.email){
        swalWithBootstrapButtons.fire({
          title: 'Vous êtes sur?',
          text: "voulez vous effectuer ce virement?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Non, Annuler!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {

            const formData = new FormData();
            formData.append('fromUserid', this.authUser.id.toString());
            formData.append('toUseremail', this.email);
            formData.append('amount', this.montant.toString());

             this.subscriptions.push(
              this.walletService.transaction(formData).subscribe(
                async (response:CustomHttpRespone)=>{
                  swalWithBootstrapButtons.fire(
                    'Succès',
                    response.message,
                    'success'
                  )
                  await this.loadWallets();
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
          "Vous ne pouvez pas transférer un montant vers ce compte",
          'error'
        );
      }
    }else{
      swalWithBootstrapButtons.fire(
        'Cancelled',
        "Email / Montant invalide",
        'error'
      )
    }
  }

  submitResult2(){
    if(this.montant>0){
      swalWithBootstrapButtons.fire({
        title: 'Vous êtes sur?',
        text: "voulez vous effectuer ce versement?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Non, Annuler!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

          const formData = new FormData();
          formData.append('userId', this.authUser.id.toString());
          formData.append('amount', this.montant.toString());

           this.subscriptions.push(
            this.walletService.versement(formData).subscribe(
              async (response:CustomHttpRespone)=>{
                swalWithBootstrapButtons.fire(
                  'Succès',
                  response.message,
                  'success'
                )
                await this.loadWallets();
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
        "Montant invalide",
        'error'
      )
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
              request.transactionType=this.selectedTransactionMethode["value"];

               this.subscriptions.push(
                this.transactionService.add(request).subscribe(
                  async (response:CustomHttpRespone)=>{
                    swalWithBootstrapButtons.fire(
                      'Succès',
                      response.message,
                      'success'
                    )
                    await this.loadWallets();
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

  openAdd(add) {
    this.modalService.open(add, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  openDemande(demande) {
    this.modalService.open(demande, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }
}
