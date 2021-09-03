import { IndexComponent } from './components/index/index.component';
import { OrderComponent } from './components/order/order.component';
import { MapsComponent } from './components/maps/maps.component';
import { MapComponent } from './components/map/map.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GetResetCodeComponent } from './components/get-reset-code/get-reset-code.component';
import { ResendVerificationComponent } from './components/resend-verification/resend-verification.component';
import { VerifyComponent } from './components/verify/verify.component';
import { Error401Component } from './components/error/error401/error401.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyComponentComponent } from './components/my-component/my-component.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";

const routes: Routes = [
  { path: "order", component: OrderComponent},
  { path: "map", component: MapComponent},
  { path: "maps", component: MapsComponent},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "verify", component: VerifyComponent},
  { path: "resend-verification", component: ResendVerificationComponent},
  { path: "forgot-password", component: GetResetCodeComponent},
  { path: "reset-password", component: ResetPasswordComponent},
  {
    path: 'home',
    component: IndexComponent,
  },
  {
    path: '/',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: ContentComponent,
    children: content
  },
  {
    path: '',
    component: FullComponent,
    children: full
  },
  {
    path: '**',
    redirectTo: 'home'
  },

];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
