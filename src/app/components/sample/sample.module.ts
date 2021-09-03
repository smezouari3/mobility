import { RegisterComponent } from './../register/register.component';
import { LoginComponent } from './../login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyComponentComponent } from './../my-component/my-component.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SampleRoutingModule,
    NgbModule
  ],
  declarations: [SampleComponent, MyComponentComponent]
})
export class SampleModule { }
