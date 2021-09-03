import { DriverTransactionComponent } from './../../components/driver-transaction/driver-transaction.component';
import { WalletComponent } from './../../components/wallet/wallet.component';
import { DriverBookingComponent } from './../../components/driver-booking/driver-booking.component';
import { Error404Component } from './../../components/error/error404/error404.component';
import { DriverPublicInfoComponent } from './../../components/driver-public-info/driver-public-info.component';
import { DriverProfilComponent } from './../../components/driver-profil/driver-profil.component';
import { MyBookingComponent } from './../../components/my-booking/my-booking.component';
import { IndexComponent } from './../../components/index/index.component';
import { BookingDriverDetailComponent } from './../../components/booking-driver-detail/booking-driver-detail.component';
import { BookingDetailComponent } from './../../components/booking-detail/booking-detail.component';
import { NotificationOrderComponent } from './../../components/notification-order/notification-order.component';
import { Error401Component } from './../../components/error/error401/error401.component';
import { ResetPasswordComponent } from './../../components/reset-password/reset-password.component';
import { GetResetCodeComponent } from './../../components/get-reset-code/get-reset-code.component';
import { ResendVerificationComponent } from './../../components/resend-verification/resend-verification.component';
import { VerifyComponent } from './../../components/verify/verify.component';
import { RegisterComponent } from './../../components/register/register.component';
import { LoginComponent } from './../../components/login/login.component';
import { Routes } from '@angular/router';
import { BookingComponent } from 'src/app/components/booking/booking.component';
import { ProfilComponent } from 'src/app/components/profil/profil.component';

export const full: Routes = [
  { path: "wallet", component: WalletComponent},
  { path: "driver-transaction", component: DriverTransactionComponent},
  { path: "driver-booking", component: DriverBookingComponent},
  { path: "notification", component: NotificationOrderComponent},
  { path: "my-booking", component: MyBookingComponent},
  { path: "booking/:id", component: BookingDetailComponent},
  { path: "get-booking/:id", component: BookingDriverDetailComponent},
  { path: "booking", component: BookingComponent},
  { path: "profil", component: ProfilComponent},
  { path: "driver-profil", component: DriverProfilComponent},
  { path: "driverprofil/:id", component: DriverPublicInfoComponent},
/*   { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "verify", component: VerifyComponent},
  { path: "resend-verification", component: ResendVerificationComponent},
  { path: "forgot-password", component: GetResetCodeComponent},
  { path: "reset-password", component: ResetPasswordComponent}, */
  { path: "error401", component: Error401Component},
  { path: "error404", component: Error404Component},
  // { path: "", component: IndexComponent},
  // { path: "index", component: IndexComponent},

];
