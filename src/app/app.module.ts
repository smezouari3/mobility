import { TransactionService } from './service/transaction.service';
import { WalletService } from './service/wallet.service';
import { LocalisationService } from './service/localisation.service';
import { CountToModule } from 'angular-count-to';
import { SettingsService } from './service/settings.service';
import { RatingService } from './service/rating.service';
import { DriverService } from './service/driver.service';
import { NotificationService } from './service/notification.service';
import { WebSocketService } from './service/web-socket.service';
import { BookingService } from './service/booking.service';
import { CityService } from './service/city.service';
import { VehicleService } from './service/vehicle.service';
import { VehicleTypeService } from './service/vehicle-type.service';
import { VehicleCategoryService } from './service/vehicle-category.service';
import { AuthorisationService } from './service/authorisation.service';
import { MessageService } from './service/message.service';
import { ConfirmationService } from './service/confirmation.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { UserService } from './service/user.service';
import { AuthenticationService } from './service/authentication.service';
import { MyComponentComponent } from './components/my-component/my-component.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserListComponent } from './components/user/user-list/user-list.component';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { UserComponent } from './components/user/user.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadModule } from 'primeng/fileupload';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { Error401Component } from './components/error/error401/error401.component';
import { Error400Component } from './components/error/error400/error400.component';
import { Error403Component } from './components/error/error403/error403.component';
import { Error404Component } from './components/error/error404/error404.component';
import { Error500Component } from './components/error/error500/error500.component';
import { Error503Component } from './components/error/error503/error503.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResendVerificationComponent } from './components/resend-verification/resend-verification.component';
import { GetResetCodeComponent } from './components/get-reset-code/get-reset-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VehicleCategoryListComponent } from './components/vehicle-category/vehicle-category-list/vehicle-category-list.component';
import { VehicleCategoryComponent } from './components/vehicle-category/vehicle-category.component';
import { VehicleCategoryEditComponent } from './components/vehicle-category/vehicle-category-edit/vehicle-category-edit.component';
import { VehicleCategoryAddComponent } from './components/vehicle-category/vehicle-category-add/vehicle-category-add.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { VehicleTypeAddComponent } from './components/vehicle-type/vehicle-type-add/vehicle-type-add.component';
import { VehicleTypeListComponent } from './components/vehicle-type/vehicle-type-list/vehicle-type-list.component';
import { VehicleTypeEditComponent } from './components/vehicle-type/vehicle-type-edit/vehicle-type-edit.component';
import { VehicleEditComponent } from './components/vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { VehicleAddComponent } from './components/vehicle/vehicle-add/vehicle-add.component';
import { VehicleListComponent } from './components/vehicle/vehicle-list/vehicle-list.component';
import { MapComponent } from './components/map/map.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MapsComponent } from './components/maps/maps.component';
import { OrderComponent } from './components/order/order.component';
import { NotificationOrderComponent } from './components/notification-order/notification-order.component';
import { RealNotificationComponent } from './components/real-notification/real-notification.component';
import { BookingDetailComponent } from './components/booking-detail/booking-detail.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BookingDriverDetailComponent } from './components/booking-driver-detail/booking-driver-detail.component';
import { BookingComponent } from './components/booking/booking.component';
import { ProfilComponent } from './components/profil/profil.component';
import { IndexComponent } from './components/index/index.component';
import { MyBookingComponent } from './components/my-booking/my-booking.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { DriverProfilComponent } from './components/driver-profil/driver-profil.component';
import { DriverPublicInfoComponent } from './components/driver-public-info/driver-public-info.component';
import { DriverBookingComponent } from './components/driver-booking/driver-booking.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { DriverTransactionComponent } from './components/driver-transaction/driver-transaction.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingsListComponent } from './components/bookings/bookings-list/bookings-list.component';
import { BookingsDetailComponent } from './components/bookings/bookings-detail/bookings-detail.component';
import { ListOfUserComponent } from './components/users/list-of-user/list-of-user.component';
import { ProfilUserComponent } from './components/users/profil-user/profil-user.component';
import { RequestTransactionListComponent } from './components/transactions/request-transaction-list/request-transaction-list.component';
import { CityComponent } from './components/city/city.component';
import { CitiesListComponent } from './components/city/cities-list/cities-list.component';
import { CitiyAddComponent } from './components/city/citiy-add/citiy-add.component';
import { CitiyEditComponent } from './components/city/citiy-edit/citiy-edit.component';
import { AdminProfilComponent } from './components/admin-profil/admin-profil.component';
import { BookingAddComponent } from './components/bookings/booking-add/booking-add.component';
import { TransactionAddComponent } from './components/transactions/transaction-add/transaction-add.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
};





export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent, LoginComponent, RegisterComponent, UserListComponent, UserComponent, UserAddComponent, UserEditComponent, Error401Component, Error400Component, Error403Component, Error404Component, Error500Component, Error503Component, VerifyComponent, ResendVerificationComponent, GetResetCodeComponent, ResetPasswordComponent, VehicleCategoryListComponent, VehicleCategoryComponent, VehicleCategoryEditComponent, VehicleCategoryAddComponent, VehicleTypeComponent, VehicleTypeAddComponent, VehicleTypeListComponent, VehicleTypeEditComponent, VehicleEditComponent, VehicleComponent, VehicleAddComponent, VehicleListComponent, MapComponent, MapsComponent, OrderComponent, NotificationOrderComponent, RealNotificationComponent, BookingDetailComponent, BookingDriverDetailComponent, BookingComponent, ProfilComponent, IndexComponent, MyBookingComponent, DriverProfilComponent, DriverPublicInfoComponent, DriverBookingComponent, WalletComponent, DriverTransactionComponent, BookingsComponent, BookingsListComponent, BookingsDetailComponent, ListOfUserComponent, ProfilUserComponent, RequestTransactionListComponent, CityComponent, CitiesListComponent, CitiyAddComponent, CitiyEditComponent, AdminProfilComponent, BookingAddComponent, TransactionAddComponent
  ],
  imports: [
    PerfectScrollbarModule,
    CountToModule,
    CarouselModule,
    SimpleNotificationsModule.forRoot(),
    FileUploadModule,
    ImageCropperModule,
    NgSelectModule,
    TableModule,
    DialogModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    GooglePlaceModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    // for HttpClient use:
    LoadingBarHttpClientModule,
    // for Router use:
    LoadingBarRouterModule,
    // for Core use:
    LoadingBarModule,
    NgbModule,
    NgxDatatableModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
  ],
  providers: [
    TransactionService,
    WalletService,
    LocalisationService,
    WebSocketService,
    MessageService,
    ConfirmationService,
    AuthenticationService,
    AuthorisationService,
    UserService,
    AuthenticationGuard,
    VehicleCategoryService,
    VehicleTypeService,
    VehicleService,
    CityService,
    BookingService,
    NotificationService,
    DriverService,
    RatingService,
    SettingsService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
