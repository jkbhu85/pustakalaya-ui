import { NgModule } from '@angular/core';
import { AppCommonModule } from '../modules/app-common.module';
import { CountryService } from './country.service';

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [],
  providers: [
    CountryService
  ]
})
export class CountryModule { }
