import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoPedidoPage } from './info-pedido';

@NgModule({
  declarations: [
    InfoPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoPedidoPage),
  ],
})
export class InfoPedidoPageModule {}
