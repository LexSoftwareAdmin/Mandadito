import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalificacionesPage } from './calificaciones';

@NgModule({
  declarations: [
    CalificacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(CalificacionesPage),
  ],
})
export class CalificacionesPageModule {}
