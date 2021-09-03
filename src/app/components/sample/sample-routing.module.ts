import { MyComponentComponent } from './../my-component/my-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SampleComponent } from './sample.component';

const routes: Routes = [
  {
    path: '',
    component: SampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
