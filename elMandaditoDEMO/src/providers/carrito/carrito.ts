import { Injectable } from '@angular/core';

@Injectable()
export class CarritoProvider {

  productos:any[] = [];

  constructor() {
    this.cargar_productos();
  }

  agregaProducto(itemEnviado:any){
      this.productos.push(itemEnviado);
      this.guardar_productos();


  }

  agregarEditado(itemEnviado:any){
    this.productos.map(data=>{
      if(data['key'] == itemEnviado['key']){
        if( itemEnviado['sugerencia'] != '') data['sugerencia'] = itemEnviado['sugerencia'];
         let cantidad = data['cantidad'] + itemEnviado['cantidad'];
         data['cantidad'] = cantidad;
         this.guardar_productos();
      }
    });
  }

  getProductos(){
    return this.productos;
  }

  eliminarProducto(id){
    let index = 0;
    this.productos.map(data=>{
      if(data['key'] == id){
        this.productos.splice(index,1); 
        this.guardar_productos(); 
      }
      index++;

    });
  }

  guardar_productos(){
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  cargar_productos(){
    if ( localStorage.getItem('productos') ){
      this.productos = JSON.parse( localStorage.getItem('productos') );
    }
  }

  

}
