import { NgModule } from '@angular/core';
import { MiscRoutingModule } from './misc-routing/misc-routing.module';
import { AppCommonModule } from '../modules/app-common.module';

@NgModule({
  imports: [
    MiscRoutingModule
  ],
  exports: [
    MiscRoutingModule
  ]
})
export class MiscModule { }
