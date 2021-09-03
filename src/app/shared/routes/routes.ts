import { BookingAddComponent } from './../../components/bookings/booking-add/booking-add.component';
import { AdminProfilComponent } from './../../components/admin-profil/admin-profil.component';
import { CityComponent } from './../../components/city/city.component';
import { RequestTransactionListComponent } from './../../components/transactions/request-transaction-list/request-transaction-list.component';
import { ProfilUserComponent } from './../../components/users/profil-user/profil-user.component';
import { ListOfUserComponent } from './../../components/users/list-of-user/list-of-user.component';
import { BookingsDetailComponent } from './../../components/bookings/bookings-detail/bookings-detail.component';
import { BookingsComponent } from './../../components/bookings/bookings.component';
import { MapComponent } from './../../components/map/map.component';
import { VehicleEditComponent } from './../../components/vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleAddComponent } from './../../components/vehicle/vehicle-add/vehicle-add.component';
import { VehicleComponent } from './../../components/vehicle/vehicle.component';
import { VehicleTypeEditComponent } from './../../components/vehicle-type/vehicle-type-edit/vehicle-type-edit.component';
import { VehicleTypeComponent } from './../../components/vehicle-type/vehicle-type.component';
import { VehicleTypeAddComponent } from './../../components/vehicle-type/vehicle-type-add/vehicle-type-add.component';
import { VehicleCategoryAddComponent } from './../../components/vehicle-category/vehicle-category-add/vehicle-category-add.component';
import { VehicleCategoryComponent } from './../../components/vehicle-category/vehicle-category.component';
import { UserEditComponent } from './../../components/user/user-edit/user-edit.component';
import { UserComponent } from 'src/app/components/user/user.component';
import { RegisterComponent } from './../../components/register/register.component';
import { LoginComponent } from './../../components/login/login.component';
import { MyComponentComponent } from './../../components/my-component/my-component.component';
import { Routes } from '@angular/router';
import { VehicleCategoryEditComponent } from 'src/app/components/vehicle-category/vehicle-category-edit/vehicle-category-edit.component';
import { UserListComponent } from 'src/app/components/user/user-list/user-list.component';


export const content: Routes = [
  { path: "profil", component: AdminProfilComponent},
  { path: "comic", component: MyComponentComponent},
  { path: "userss", component: UserComponent},

  { path: "city", component: CityComponent},
  { path: "transaction", component: RequestTransactionListComponent},

  { path: "user", component: ListOfUserComponent},
  { path: "user/:id", component: ProfilUserComponent},
  { path: "users/edit", component: UserEditComponent},

  { path: "booking", component: BookingsComponent},
  { path: "booking-add", component: BookingAddComponent},
  { path: "booking/:id", component: BookingsDetailComponent},

  { path: "vehicle-category", component: VehicleCategoryComponent},
  { path: "vehicle-categories/edit", component: VehicleCategoryEditComponent},
  { path: "vehicle-categories/add", component: VehicleCategoryAddComponent},

  { path: "vehicle-type", component: VehicleTypeComponent},
  { path: "vehicle-type/add", component: VehicleTypeAddComponent},
  { path: "vehicle-type/edit", component: VehicleTypeEditComponent},

  { path: "vehicle", component: VehicleComponent},
  { path: "vehicle/add", component: VehicleAddComponent},
  { path: "vehicle/edit", component: VehicleEditComponent},
  {
    path: 'sample-page',
    loadChildren: () => import('../../components/sample/sample.module').then(m => m.SampleModule)
  }
];
