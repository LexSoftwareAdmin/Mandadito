webpackJsonp([1],{

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PedidoPD01Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_fire_database__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pedidos_pedidos__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_bluetooth_serial__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__ = __webpack_require__(173);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var PedidoPD01Page = /** @class */ (function () {
    function PedidoPD01Page(navCtrl, navParams, afDb, afAuth, alertCtrl, toastCtrl, bluetooth, platform, loadCtrl, oneSignal) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afDb = afDb;
        this.afAuth = afAuth;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.bluetooth = bluetooth;
        this.platform = platform;
        this.loadCtrl = loadCtrl;
        this.oneSignal = oneSignal;
        this.carrito = {};
        this.direccion = {
            nomCalle: '',
            nomColonia: '',
            telefono: '',
            cp: '',
            remitente: '',
            metPago: '',
            fac: false,
            bod: false,
            usuario: '',
            categoria: '',
            sugerencia: ''
        };
        this.productos = [];
        this.total = 0;
        this.otroMet = false;
        this.imprimir = false;
        this.envio = 15;
        this.envioCond = false;
        if (this.platform.is('android'))
            this.imprimir = true;
        this.user = this.navParams.get("user");
        this.id = this.navParams.get("id");
        this.keyTien = this.afAuth.auth.currentUser.uid;
        var query = this.afDb.object("pedidos/" + this.keyTien + '/' + this.user + '/' + this.id).snapshotChanges();
        this.suscribir = query.subscribe(function (data) {
            _this.carrito = __assign({}, data.payload.val()['carrito']);
            _this.direccion = __assign({}, data.payload.val()['direccion']);
            _this.categoria = _this.direccion['categoria'];
            _this.estado = data.payload.val()['estatus'];
            console.log(_this.direccion);
            if (_this.direccion["metPago"] == 'Otro') {
                _this.otroMetodo = _this.direccion["metPago"];
                _this.otroMet = true;
            }
            for (var key in _this.carrito) {
                console.log(key);
                if (key == 'total') {
                    _this.total = _this.carrito[key];
                }
                else {
                    _this.productos.push(_this.carrito[key]);
                }
            }
            if (_this.direccion.bod) {
                _this.envioCond = false;
            }
            else {
                _this.envioCond = true;
            }
        });
    }
    PedidoPD01Page.prototype.cambiarEstado = function (e) {
        this.afDb.database.ref("pedidos/" + this.keyTien + '/' + this.user + '/' + this.id).update({
            estatus: e
        });
        var alert = this.alertCtrl.create({
            title: 'Ok',
            subTitle: 'Estatus modificado',
            buttons: ['OK']
        });
        alert.present();
        this.notificacion(e);
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__pedidos_pedidos__["a" /* PedidosPage */]);
    };
    PedidoPD01Page.prototype.notificacion = function (mensaje) {
        var _this = this;
        this.afDb.database.ref('users/' + this.user).once('value', function (data) {
            var user = data.val();
            var notificationObj = {
                app_id: "6b8e357e-3d6b-468a-a317-1ac1951994d5",
                include_player_ids: [user['userId']],
                data: { "foo": "bar" },
                headings: { "en": "El mandadito" },
                contents: { "en": 'Tu pedido esta ' + mensaje }
            };
            _this.oneSignal.postNotification(notificationObj).then(function (data) {
                console.log('funciono');
                console.log(JSON.stringify(data));
            }).catch(function (error) {
                console.log('error');
                console.log(JSON.stringify(error));
            });
        });
    };
    PedidoPD01Page.prototype.ionViewDidLeave = function () {
        this.suscribir.unsubscribe();
    };
    PedidoPD01Page.prototype.prepareToPrint = function () {
        var _this = this;
        var receipt = '';
        receipt += '\x1b\x40'; // Clear data in buffer and reset modes
        receipt += '\x1b\x21\x00'; //Normal text
        receipt += '\x1b\x61\x01'; //left justification
        receipt += '*** ';
        receipt += 'EL MANDADITO';
        receipt += ' ***';
        receipt += '\n';
        receipt += '* ';
        receipt += '\x1b\x61\x01';
        receipt += 'CENTRAL DE ABASTOS, IRAPUATO';
        receipt += ' *';
        receipt += '\n';
        receipt += '*** ';
        receipt += '\x1b\x61\x01';
        receipt += 'ANDEN 4, LOCAL 17';
        receipt += ' ***';
        receipt += '\n';
        receipt += '*** ';
        receipt += '\x1b\x61\x01';
        receipt += 'TEL: (462)';
        receipt += ' ***';
        receipt += '\n';
        receipt += '\n';
        var hora = new Date();
        receipt += '\x1b\x61\x00';
        receipt += 'FECHA:' + hora.getDate() + '/' + hora.getMonth() + 1 + '/' + hora.getFullYear();
        receipt += '  HORA:' + hora.getHours() + ':' + hora.getMinutes() + ':' + hora.getSeconds();
        receipt += '\n';
        receipt += '\n';
        receipt += 'CLIENTE: ' + this.direccion.usuario;
        receipt += '\n';
        receipt += 'CALLE: ' + this.direccion.nomCalle;
        receipt += '\n';
        receipt += 'COLONIA: ' + this.direccion.nomColonia;
        receipt += '\n';
        receipt += 'TELEFONO: ' + this.direccion.telefono;
        receipt += '\n';
        receipt += 'CP: ' + this.direccion.cp;
        receipt += '\n';
        if (!this.envioCond) {
            receipt += 'RECOGER EN BODEGA';
            receipt += '\n';
        }
        receipt += '\x1b\x45\x01';
        receipt += 'CATEGORIA: ' + this.direccion.categoria.toUpperCase();
        receipt += '\x1b\x45\x00';
        receipt += '\n';
        receipt += 'FOLIO: ' + this.id;
        receipt += '\n';
        receipt += '\n';
        receipt += '\x1b\x61\x00';
        receipt += 'CANT.';
        receipt += '   ';
        receipt += 'DESC.';
        receipt += '     ';
        receipt += 'PREC.';
        receipt += ' ';
        receipt += 'IMPO.';
        receipt += '\n';
        receipt += '================================';
        receipt += '\n';
        receipt += '\x1b\x44\x00';
        receipt += '\x1b\x44\x08\x12\x18\x00';
        this.productos.map(function (data) {
            //Cantidad
            receipt += data['cantidad'];
            receipt += ' ';
            switch (data['unidadMed']) {
                case 'Kilogramos':
                    receipt += 'KG\x09';
                    break;
                case 'Manojo':
                    receipt += 'MJ\x09';
                    break;
                case 'Charola':
                    receipt += 'CH\x09';
                    break;
                case 'Domo':
                    receipt += 'DO\x09';
                    break;
                case 'Pieza':
                    receipt += 'PZ\x09';
                    break;
            }
            var nombreCort = '';
            var nombreArr = data['nombre'].split(" ");
            if (nombreArr.length > 1) {
                for (var index = 0; index < 2; index++) {
                    var nombCarac = nombreArr[index].slice(0, 3);
                    nombreCort = nombreCort.concat(" ", nombCarac);
                }
                receipt += nombreCort + '\x09';
            }
            else {
                nombreCort = data['nombre'].slice(0, 6);
                receipt += nombreCort + '\x09';
            }
            receipt += '$' + data['precioMen'] + '\x09';
            var importe = data['precioMen'] * data['cantidad'];
            receipt += '$' + importe;
            receipt += '\n';
            if (data['sugerencia'] != '') {
                receipt += 'SUGE. ' + data['sugerencia'];
                receipt += '\n';
                receipt += '\n';
            }
        });
        receipt += '================================';
        receipt += '\n';
        receipt += '\n';
        if (this.envioCond) {
            receipt += 'GASTO DE ENVIO: $15';
            receipt += '\n';
        }
        receipt += '\x1b\x61\x00';
        receipt += 'IMPORTE TOTAL: $' + this.total;
        receipt += '\n';
        receipt += this.productos.length + ' PRODUCTO(S)';
        receipt += '\n\n';
        receipt += '** ';
        receipt += '\x1b\x61\x01';
        receipt += 'AGRADECEMOS SU PREFERENCIA';
        receipt += ' **';
        receipt += '\n';
        receipt += '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _';
        receipt += '\n\n';
        var alert = this.alertCtrl.create({
            title: 'Selecciona tu impresora',
            buttons: [{
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Selecciona impresora',
                    handler: function (device) {
                        if (!device) {
                            _this.showToast('Selecciona una impresora');
                            return false;
                        }
                        console.log(device);
                        _this.print(device, receipt);
                    }
                }
            ]
        });
        this.bluetooth.enable().then(function () {
            _this.bluetooth.list().then(function (devices) {
                devices.forEach(function (devices) {
                    console.log('Devices: ', JSON.stringify(devices));
                    alert.addInput({
                        name: 'printer',
                        value: devices.address,
                        label: devices.name,
                        type: 'radio'
                    });
                });
                alert.present();
            }).catch(function (error) {
                console.log(error);
                _this.showToast('Hubo un error al conectarse con la impresora, Intente de nuevo.');
            });
        }).catch(function (error) {
            console.log(error);
            _this.showToast('Error al activar el Bluetooth, Intente de nuevo.');
        });
    };
    PedidoPD01Page.prototype.showToast = function (data) {
        var toast = this.toastCtrl.create({
            duration: 3000,
            message: data,
            position: 'bottom'
        });
        toast.present();
    };
    PedidoPD01Page.prototype.print = function (device, ticket) {
        var _this = this;
        console.log('Device mac: ', device);
        console.log('Data: ', ticket);
        var load = this.loadCtrl.create({
            content: 'Imprimiendo...',
        });
        load.present();
        this.bluetooth.connect(device).subscribe(function (status) {
            console.log(status);
            _this.bluetooth.write(_this.noSpecialChars(ticket)).then(function (printStatus) {
                var alert = _this.alertCtrl.create({
                    title: 'Impresion exitosa',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: function () {
                                load.dismiss();
                                _this.bluetooth.disconnect();
                            }
                        }
                    ]
                });
                alert.present();
            }).catch(function (error) {
                console.log(error);
                var alert = _this.alertCtrl.create({
                    title: 'Hubo un error al imprimir, Intente de nuevo',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: function () {
                                load.dismiss();
                            }
                        }
                    ]
                });
                alert.present();
            });
        }, function (error) {
            console.log(error);
            var alert = _this.alertCtrl.create({
                title: 'Hubo un error al conectarse con la impresora, Intente de nuevo',
                buttons: [
                    {
                        text: 'Ok',
                        handler: function () {
                            load.dismiss();
                        }
                    }
                ]
            });
            alert.present();
        });
    };
    PedidoPD01Page.prototype.noSpecialChars = function (string) {
        var translate = {
            à: 'a',
            á: 'a',
            â: 'a',
            ã: 'a',
            ä: 'a',
            å: 'a',
            æ: 'a',
            ç: 'c',
            è: 'e',
            é: 'e',
            ê: 'e',
            ë: 'e',
            ì: 'i',
            í: 'i',
            î: 'i',
            ï: 'i',
            ð: 'd',
            ñ: 'n',
            ò: 'o',
            ó: 'o',
            ô: 'o',
            õ: 'o',
            ö: 'o',
            ø: 'o',
            ù: 'u',
            ú: 'u',
            û: 'u',
            ü: 'u',
            ý: 'y',
            þ: 'b',
            ÿ: 'y',
            ŕ: 'r',
            À: 'A',
            Á: 'A',
            Â: 'A',
            Ã: 'A',
            Ä: 'A',
            Å: 'A',
            Æ: 'A',
            Ç: 'C',
            È: 'E',
            É: 'E',
            Ê: 'E',
            Ë: 'E',
            Ì: 'I',
            Í: 'I',
            Î: 'I',
            Ï: 'I',
            Ð: 'D',
            Ñ: 'N',
            Ò: 'O',
            Ó: 'O',
            Ô: 'O',
            Õ: 'O',
            Ö: 'O',
            Ø: 'O',
            Ù: 'U',
            Ú: 'U',
            Û: 'U',
            Ü: 'U',
            Ý: 'Y',
            Þ: 'B',
            Ÿ: 'Y',
            Ŕ: 'R',
        }, translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
        return string.replace(translate_re, function (match) {
            return translate[match];
        });
    };
    PedidoPD01Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-pedido-pd01',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedido-pd01/pedido-pd01.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Pedido: {{id}}\n    </ion-title>\n    <ion-buttons end *ngIf=\'imprimir\'>\n      <button ion-button icon-only (tap)=\'prepareToPrint()\'>\n        <ion-icon name="print"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n<ion-content padding style="background:url(assets/img/uLat0LoFRjOEGlafEFXO_4.png) no-repeat center;background-size:cover;" id="page9">\n  <div class="spacer" style="width:748px;height:20px;" id="pedidoPD01-spacer18"></div>\n  <h1 id="pedidoPD01-heading6" style="color:#FFFFFF;font-weight:600;">\n    Usuario: {{direccion.usuario}}\n  </h1>\n  <div id="pedidoPD01-markdown3" class="show-list-numbers-and-dots">\n    <p style="color:#FFFFFF;font-size:30px;">\n      <strong>\n        Total:\n      </strong>\n      ${{total}}\n    </p>\n    <p style="color:#FFFFFF;font-size:30px;">\n      <strong>\n        Categoria:\n      </strong>\n       {{categoria}}\n    </p>\n  </div>\n  <div class="spacer" style="width:748px;height:28px;" id="pedidoPD01-spacer19"></div>\n  <ion-list id="pedidoPD01-list7">\n    <ion-item-divider color="light" id="pedidoPD01-list-item-divider5">\n      Descripción del Pedido\n    </ion-item-divider>\n    <ion-item *ngFor="let producto of productos">\n      <ion-thumbnail item-left>\n        <img src={{producto.url}} />\n      </ion-thumbnail>\n      <h2>\n        {{producto.nombre}}\n      </h2>\n      <p>cantidad: {{producto.cantidad}} {{producto.unidadMed}}</p>\n      <p *ngIf="producto.sugerencia != \'\'  && producto.sugerencia">Sugerencia: {{producto.sugerencia}}</p>\n    </ion-item>\n  </ion-list>\n  <h2 id="pedidoPD01-heading8" style="color:#FFFFFF;font-weight:600;">\n    Datos de Envío\n  </h2>\n  <ion-list id="pedidoPD01-list8">\n    <ion-item-divider color="light" id="pedidoPD01-list-item-divider6">\n      Dirección de Cliente\n    </ion-item-divider>\n    <ion-item *ngIf=\'envioCond\'> \n      <h2>Gastos de envio ${{envio}}</h2>\n    </ion-item>\n    <ion-item>\n      <ion-label>\n        Destinatario\n      </ion-label>\n      <ion-input type="text" [(ngModel)]="direccion.remitente" disabled></ion-input>\n    </ion-item>\n    <ion-item id="pedidoPD01-input11">\n      <ion-label>\n        Calle\n      </ion-label>\n      <ion-input type="text" [(ngModel)]="direccion.nomCalle" disabled></ion-input>\n    </ion-item>\n    <ion-item id="pedidoPD01-input12">\n      <ion-label>\n        Colonia\n      </ion-label>\n      <ion-input type="text" [(ngModel)]="direccion.nomColonia" disabled></ion-input>\n    </ion-item>\n    <ion-item >\n      <ion-label>\n        Codigo postal\n      </ion-label>\n      <ion-input type="text" [(ngModel)]="direccion.cp" disabled></ion-input>\n    </ion-item>\n    <ion-item id="pedidoPD01-input13">\n      <ion-label>\n        Teléfono\n      </ion-label>\n      <ion-input type="text" [(ngModel)]="direccion.telefono" disabled></ion-input>\n    </ion-item>\n    <ion-item >\n      <ion-label>Metodo de pago</ion-label>\n      <ion-input [(ngModel)]="direccion.metPago" type="text"></ion-input>\n    </ion-item>\n    <ion-item *ngIf="otroMet">\n      <ion-label>Especifique</ion-label>\n      <ion-input [(ngModel)]="otroMetodo" type="text"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label>Recoger en bodega</ion-label>\n      <ion-checkbox color="dark" [(ngModel)]="direccion.bod" disabled></ion-checkbox>\n    </ion-item>\n    <ion-item>\n      <ion-label>Requiero factura</ion-label>\n      <ion-checkbox color="dark" [(ngModel)]="direccion.fac" disabled></ion-checkbox>\n    </ion-item>\n    <br>\n    <ion-item>\n      <ion-label>Sugerencia</ion-label>\n      <ion-input [(ngModel)]="direccion.sugerencia" type="text" readonly></ion-input>\n    </ion-item>\n  </ion-list>\n  <h2 id="pedidoPD01-heading9" style="color:#FFFFFF;font-weight:600;">\n    Estatus del Pedido\n  </h2>\n  <ion-item >\n    <ion-label>Estatus</ion-label>\n    <ion-select [(ngModel)]="estado" (ionChange)="cambiarEstado($event)">\n      <ion-option>Surtiendo</ion-option>\n      <ion-option>En ruta</ion-option>\n      <ion-option>Entregado</ion-option>\n    </ion-select>\n  </ion-item>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedido-pd01/pedido-pd01.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_fire_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_3__angular_fire_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_bluetooth_serial__["a" /* BluetoothSerial */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__["a" /* OneSignal */]])
    ], PedidoPD01Page);
    return PedidoPD01Page;
}());

//# sourceMappingURL=pedido-pd01.js.map

/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PedidosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pedido_pd01_pedido_pd01__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pedido_pd05_pedido_pd05__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_fire_database__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__ = __webpack_require__(38);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PedidosPage = /** @class */ (function () {
    function PedidosPage(navCtrl, afDb, afAuth, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.afDb = afDb;
        this.afAuth = afAuth;
        this.alertCtrl = alertCtrl;
        this.pedidos = [];
        this.estado = "todos";
        this.entregados = [];
        this.noEntregados = [];
        this.keyTien = this.afAuth.auth.currentUser.uid;
        this.afDb.list("pedidos/" + this.keyTien).snapshotChanges().subscribe(function (data) {
            _this.pedidos = [];
            _this.entregados = [];
            _this.noEntregados = [];
            var usuario = data.map(function (data) { return ({ key: data.key }); });
            usuario.map(function (data) {
                var userKey = data.key;
                _this.afDb.list("pedidos/" + _this.keyTien + '/' + userKey).snapshotChanges().subscribe(function (data) {
                    data.map(function (data) {
                        var estado = data.payload.val()['estatus'];
                        var color;
                        switch (estado) {
                            case 'Surtiendo':
                                color = 'verde';
                                break;
                            case 'En ruta':
                                color = 'amarillo';
                                break;
                            case 'Entregado':
                                color = 'rojo';
                                break;
                        }
                        if (estado == 'Entregado') {
                            _this.entregados.push({ key: data.key, user: userKey, estado: estado, color: color });
                        }
                        else {
                            _this.noEntregados.push({ key: data.key, user: userKey, estado: estado, color: color });
                        }
                        _this.pedidos.push({ key: data.key, user: userKey, estado: estado, color: color });
                    });
                });
            });
        });
    }
    PedidosPage.prototype.infoPedido = function (id, user) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__pedido_pd01_pedido_pd01__["a" /* PedidoPD01Page */], { id: id, user: user });
    };
    PedidosPage.prototype.goToPedidoPD01 = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__pedido_pd01_pedido_pd01__["a" /* PedidoPD01Page */]);
    };
    PedidosPage.prototype.goToPedidoPD05 = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__pedido_pd05_pedido_pd05__["a" /* PedidoPD05Page */]);
    };
    PedidosPage.prototype.eliminar = function (key, user) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Eliminar pedido',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: function () {
                        _this.afDb.database.ref('pedidos/' + _this.keyTien + '/' + user + '/' + key).once('value', function (data) {
                            var objeto = data.val();
                            _this.afDb.database.ref('eliminados/' + _this.keyTien + '/' + user + '/' + key).push({ objeto: objeto });
                            _this.afDb.database.ref('pedidos/' + _this.keyTien + '/' + user + '/' + key).remove();
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    PedidosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-pedidos',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedidos/pedidos.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-segment [(ngModel)]="estado">\n      <ion-segment-button value="todos">\n        Todos\n      </ion-segment-button>\n      <ion-segment-button value="entregados">\n        Entregados\n      </ion-segment-button>\n      <ion-segment-button value="noEntregados">\n        No Entregados\n      </ion-segment-button>\n    </ion-segment>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding style="background:url(assets/img/cz1VLAfVSZK6UJsE5cKe_4.png) no-repeat center;background-size:cover;" id="page3">\n  <div class="spacer" style="width:748px;height:20px;" id="pedidos-spacer16"></div>\n  <h1 id="pedidos-heading5" style="color:#FFFFFF;font-weight:600;">\n    Mi Lista de Pedidos\n  </h1>\n  <div class="spacer" style="width:748px;height:19px;" id="pedidos-spacer17"></div>\n  <div [ngSwitch]="estado">\n      <ion-list *ngSwitchCase="\'todos\'">\n          <ion-item-divider color="light" id="pedidos-list-item-divider4">\n            Listado de Pedidos en el Sistema\n          </ion-item-divider>\n          <ion-item *ngFor="let pedido of pedidos" >\n            <ion-avatar item-left (tap)="infoPedido(pedido.key, pedido.user)">\n              <img src="assets/img/2iymf5pT8CGZbXcutCuQ_iconos-carretilla.png" />\n            </ion-avatar>\n            <div class="etiqueta {{pedido.color}}" (tap)="infoPedido(pedido.key, pedido.user)">\n      \n            </div>\n            <h2 (tap)="infoPedido(pedido.key, pedido.user)">\n              ID del Pedido: {{pedido.key}}\n            </h2>\n            <p class="parrafo" text-end (tap)="infoPedido(pedido.key, pedido.user)">{{pedido.estado}}</p>\n            <button class="eliminar" *ngIf="pedido.estado==\'Entregado\'" (tap) = "eliminar(pedido.key, pedido.user)" ion-button icon-only item-end>\n              <ion-icon name="trash"></ion-icon>\n            </button>\n            \n          </ion-item>\n        </ion-list>\n        <ion-list *ngSwitchCase="\'entregados\'">\n            <ion-item-divider color="light" id="pedidos-list-item-divider4">\n              Listado de Pedidos en el Sistema\n            </ion-item-divider>\n            <ion-item *ngFor="let pedido of entregados" (tap)="infoPedido(pedido.key, pedido.user)">\n              <ion-avatar item-left>\n                <img src="assets/img/2iymf5pT8CGZbXcutCuQ_iconos-carretilla.png" />\n              </ion-avatar>\n              <div class="etiqueta {{pedido.color}}">\n        \n              </div>\n              <h2>\n                ID del Pedido: {{pedido.key}}\n              </h2>\n              <p class="parrafo" text-end>{{pedido.estado}}</p>\n              \n            </ion-item>\n          </ion-list>\n          <ion-list *ngSwitchCase="\'noEntregados\'">\n              <ion-item-divider color="light" id="pedidos-list-item-divider4">\n                Listado de Pedidos en el Sistema\n              </ion-item-divider>\n              <ion-item *ngFor="let pedido of noEntregados" (tap)="infoPedido(pedido.key, pedido.user)">\n                <ion-avatar item-left>\n                  <img src="assets/img/2iymf5pT8CGZbXcutCuQ_iconos-carretilla.png" />\n                </ion-avatar>\n                <div class="etiqueta {{pedido.color}}">\n          \n                </div>\n                <h2>\n                  ID del Pedido: {{pedido.key}}\n                </h2>\n                <p class="parrafo" text-end>{{pedido.estado}}</p>\n                \n              </ion-item>\n            </ion-list>\n\n  </div>\n  \n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedidos/pedidos.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__angular_fire_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], PedidosPage);
    return PedidosPage;
}());

//# sourceMappingURL=pedidos.js.map

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AltaDeNuevoProductoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_storage__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_storage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angularfire2_storage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angularfire2_database__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AltaDeNuevoProductoPage = /** @class */ (function () {
    function AltaDeNuevoProductoPage(platform, actionsheetCtrl, loadingCtrl, camara, navCtrl, navParams, afDatabase, afAuth, afStorage, alertCtrl, toastCtrl) {
        var _this = this;
        this.platform = platform;
        this.actionsheetCtrl = actionsheetCtrl;
        this.loadingCtrl = loadingCtrl;
        this.camara = camara;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afDatabase = afDatabase;
        this.afAuth = afAuth;
        this.afStorage = afStorage;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.nombrePro = "";
        this.categoPro = "";
        this.imagen = "../../assets/imgs/noImagen.jpg";
        this.foto = "";
        this.camImg = false;
        this.titulo = "";
        this.editCond = false;
        this.precioMay = '';
        this.precioMen = '';
        this.unidadMed = '';
        this.descripcion = '';
        this.Uid = this.afAuth.auth.currentUser.uid;
        this.editar = this.navParams.get("key");
        if (this.editar != undefined) {
            this.titulo = "Editar Producto";
            this.editCond = true;
            this.afDatabase.database.ref("productos/" + this.Uid + "/" + this.editar).once("value").then(function (data) {
                var info = data.val();
                _this.nombrePro = info.nombre;
                _this.precioMay = info.precioMay;
                _this.precioMen = info.precioMen;
                _this.unidadMed = info.unidadMed;
                _this.categoPro = info.categoPro;
                _this.imagen = info.url;
                _this.keyImg = info.horaRegistro;
                if (info.descripcion)
                    _this.descripcion = info.descripcion;
                else
                    _this.descripcion = '';
            });
        }
        else {
            this.titulo = "Agregar producto";
        }
    }
    AltaDeNuevoProductoPage.prototype.selecImagen = function () {
        var _this = this;
        var actionSheet = this.actionsheetCtrl.create({
            title: 'Subir imagen',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Camara',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: function () {
                        _this.imgPreCam();
                    }
                },
                {
                    text: 'Album',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: function () {
                        _this.imgPreAlb();
                    }
                }
            ]
        });
        actionSheet.present();
    };
    AltaDeNuevoProductoPage.prototype.imgPreAlb = function () {
        var _this = this;
        var imagen = document.getElementById("producto");
        this.camara.getPicture({
            quality: 100,
            destinationType: this.camara.DestinationType.DATA_URL,
            sourceType: this.camara.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: this.camara.EncodingType.JPEG,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: true
        }).then(function (foto) {
            debugger;
            _this.camImg = true;
            _this.foto = foto;
            _this.imagen = 'data:image/jpg;base64,' + foto;
            foto = escape(foto);
            //imagen.setAttribute("src",'data:image/jpg;base64,'+foto);
        });
    };
    AltaDeNuevoProductoPage.prototype.imgPreCam = function () {
        var _this = this;
        var imagen = document.getElementById("producto");
        this.camara.getPicture({
            quality: 100,
            destinationType: this.camara.DestinationType.DATA_URL,
            sourceType: this.camara.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: this.camara.EncodingType.JPEG,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: true
        }).then(function (foto) {
            _this.camImg = true;
            _this.foto = foto;
            _this.imagen = 'data:image/jpg;base64,' + foto;
            foto = escape(foto);
            //imagen.setAttribute("src",'data:image/jpg;base64,'+foto);
        });
    };
    AltaDeNuevoProductoPage.prototype.guardarProducto = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Guardando...",
            spinner: "crescent"
        });
        var hora = Date.now();
        loader.present();
        this.afStorage.ref('admin/' + this.Uid + '/productos/' + hora).putString(this.foto, 'base64', { contentType: 'image/jpg' }).then(function (fotoGuard) {
            var snapFoto = fotoGuard.ref.getDownloadURL();
            snapFoto.then(function (data) {
                _this.afDatabase.database.ref("productos/" + _this.Uid + '/' + hora).set({
                    nombre: _this.nombrePro,
                    unidadMed: _this.unidadMed,
                    categoPro: _this.categoPro,
                    precioMen: _this.precioMen,
                    precioMay: _this.precioMay,
                    url: data,
                    descripcion: _this.descripcion,
                    horaRegistro: hora,
                });
                loader.dismiss();
                _this.navCtrl.pop();
            });
        });
    };
    AltaDeNuevoProductoPage.prototype.editarProducto = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Guardando...",
            spinner: "crescent"
        });
        loader.present();
        if (this.camImg) {
            this.afStorage.ref('admin/' + this.Uid + '/productos/' + this.keyImg).putString(this.foto, 'base64', { contentType: 'image/jpg' }).then(function (fotoGuard) {
                var snapFoto = fotoGuard.ref.getDownloadURL();
                snapFoto.then(function (data) {
                    _this.afDatabase.database.ref("productos/" + _this.Uid + "/" + _this.editar).update({
                        unidadMed: _this.unidadMed,
                        categoPro: _this.categoPro,
                        precioMen: _this.precioMen,
                        precioMay: _this.precioMay,
                        url: data,
                        descripcion: _this.descripcion
                    });
                    loader.dismiss();
                    _this.navCtrl.pop();
                });
            });
        }
        else {
            this.afDatabase.database.ref("productos/" + this.Uid + "/" + this.editar).update({
                nombre: this.nombrePro,
                categoPro: this.categoPro,
                unidadMed: this.unidadMed,
                precioMen: this.precioMen,
                precioMay: this.precioMay,
                descripcion: this.descripcion
            });
            loader.dismiss();
            this.navCtrl.pop();
        }
    };
    AltaDeNuevoProductoPage.prototype.verificarCampos = function (guardar) {
        if (guardar) {
            if (this.nombrePro == '' || this.precioMay == '' || this.categoPro == '' ||
                this.unidadMed == '' || this.precioMen == '' || this.imagen == '../../assets/imgs/noImagen.jpg'
                || this.descripcion == '') {
                var error = this.alertCtrl.create({
                    title: 'Error',
                    message: 'Llene todos los campos.',
                    buttons: ['OK']
                });
                error.present();
            }
            else {
                var signo = this.noSignos('nombre', false);
                signo = this.noSignos('descripcion', false);
                if (signo) {
                    this.guardarProducto();
                }
                else {
                    var error = this.alertCtrl.create({
                        title: 'Error',
                        message: 'Revise los campos que no tengan caracteres especiales.',
                        buttons: ['OK']
                    });
                    error.present();
                }
            }
        }
        else {
            if (this.nombrePro == '' || this.precioMay == '' || this.categoPro == ''
                || this.precioMen == '' || this.unidadMed == '' || this.descripcion == '') {
                var error = this.alertCtrl.create({
                    title: 'Error',
                    message: 'Llene todos los campos.',
                    buttons: ['OK']
                });
                error.present();
            }
            else {
                var signo = this.noSignos('nombre', false);
                signo = this.noSignos('descripcion', false);
                if (signo) {
                    this.editarProducto();
                }
                else {
                    var error = this.alertCtrl.create({
                        title: 'Error',
                        message: 'Revise los campos que no tengan caracteres especiales.',
                        buttons: ['OK']
                    });
                    error.present();
                }
            }
        }
    };
    AltaDeNuevoProductoPage.prototype.ediCon = function () {
        var _this = this;
        var confirmacion = this.alertCtrl.create({
            title: '¿Esta seguro?',
            message: 'Se cambiara la informacion del producto de forma permanente.',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: function () {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: function () {
                        _this.verificarCampos(false);
                    }
                }
            ]
        });
        confirmacion.present();
    };
    AltaDeNuevoProductoPage.prototype.noSignos = function (campo, toas) {
        if (campo == 'nombre')
            campo = this.nombrePro;
        else
            campo = this.descripcion;
        var expr = /^[a-zA-ZÀ-ÖØ-öø-ÿs0-9]+(\s[a-zA-ZÀ-ÖØ-öø-ÿs0-9]+)*$/;
        var cadena = expr.test(campo);
        if (!cadena && toas) {
            var toast = this.toastCtrl.create({
                message: 'No se admiten caracteres especiales',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
        return cadena;
    };
    AltaDeNuevoProductoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-alta-de-nuevo-producto',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/alta-de-nuevo-producto/alta-de-nuevo-producto.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      {{titulo}}\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content >\n  \n  <ion-card class="card">\n    <ion-card-header text-center>\n      Datos del producto\n    </ion-card-header>\n    <ion-card-content>\n      <ion-list>\n        <ion-item > \n          <ion-label floating>Nombre del producto</ion-label>\n          <ion-input [(ngModel)]="nombrePro" (ionBlur)=\'noSignos("nombre",true)\' type="text"></ion-input> \n        </ion-item>\n\n        <ion-item > \n          <ion-label floating>Descripción</ion-label>\n          <ion-input [(ngModel)]="descripcion" (ionBlur)=\'noSignos("descripcion",true)\' type="text"></ion-input> \n        </ion-item>\n\n        <ion-item class="sele"> \n          <ion-label>\n            Unidad de medida\n          </ion-label>\n    \n          <ion-select [(ngModel)]="unidadMed" (ionChange)="pieza($event)"> \n            <ion-option >Kilogramos</ion-option>\n            <ion-option >Manojo</ion-option>\n            <ion-option >Charola</ion-option>\n            <ion-option >Domo</ion-option>\n            <ion-option >Pieza</ion-option>\n          </ion-select>\n        </ion-item>\n\n        <ion-item class="sele" *ngIf="piezaval"> \n          <ion-label>\n            Tamaño de la pieza\n          </ion-label>\n    \n          <ion-select [(ngModel)]="piezaPro"> \n            <ion-option >Chico</ion-option>\n            <ion-option >Mediano</ion-option>\n            <ion-option >Grande</ion-option>\n          </ion-select>\n        </ion-item>\n\n          <ion-item >\n            <ion-label floating>Precio mayoreo</ion-label>\n            <ion-input [(ngModel)]="precioMay" type="number"></ion-input>\n          </ion-item>\n      \n          <ion-item > \n            <ion-label floating>Precio menudeo</ion-label>\n            <ion-input [(ngModel)]="precioMen" type="number"></ion-input>\n          </ion-item>\n    \n        <ion-item class="sele">\n          <ion-label> \n            Categoría de Producto\n          </ion-label>\n    \n          <ion-select  [(ngModel)]="categoPro" >\n            <ion-option >Frutas</ion-option>\n            <ion-option >Verduras</ion-option>\n            <ion-option >Basicos</ion-option>\n          </ion-select>\n        </ion-item>\n        <img class="img" src={{imagen}} alt="imagen del producto" id="producto">\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n\n\n      <button class="boton" ion-button color="secondary" block (tap)="selecImagen()">Imagen del Producto</button>   \n      <button *ngIf="!editCond" class="boton" (tap)="verificarCampos(true)" ion-button block>Guardar Cambios</button>\n      <button *ngIf="editCond" class="boton"  (tap)="ediCon()" ion-button block>Guardar Cambios</button>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/alta-de-nuevo-producto/alta-de-nuevo-producto.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_3_angularfire2_storage__["AngularFireStorage"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */]])
    ], AltaDeNuevoProductoPage);
    return AltaDeNuevoProductoPage;
}());

//# sourceMappingURL=alta-de-nuevo-producto.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsControllerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__usuarios_usuarios__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pedidos_pedidos__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inventario_inventario__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_fire_database__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_fire_auth__ = __webpack_require__(38);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TabsControllerPage = /** @class */ (function () {
    function TabsControllerPage(navCtrl, afDb, afAuth) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.afDb = afDb;
        this.afAuth = afAuth;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__usuarios_usuarios__["a" /* UsuariosPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__pedidos_pedidos__["a" /* PedidosPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_4__inventario_inventario__["a" /* InventarioPage */];
        this.badgeSurtiendo = 0;
        this.keyTien = this.afAuth.auth.currentUser.uid;
        this.afDb.list("pedidos/" + this.keyTien).snapshotChanges().subscribe(function (data) {
            _this.badgeSurtiendo = 0;
            var usuario = data.map(function (data) { return ({ key: data.key }); });
            usuario.map(function (data) {
                var userKey = data.key;
                _this.afDb.list("pedidos/" + _this.keyTien + '/' + userKey).snapshotChanges().subscribe(function (data) {
                    data.map(function (data) {
                        var estado = data.payload.val()['estatus'];
                        if (estado == 'Surtiendo') {
                            _this.badgeSurtiendo += 1;
                        }
                    });
                });
            });
        });
        if (this.badgeSurtiendo == 0)
            this.badgeSurtiendo = '';
    }
    TabsControllerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tabs-controller',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/tabs-controller/tabs-controller.html"*/'<ion-tabs id="tabsController-tabs1">\n  <ion-tab [root]="tab1Root" tabTitle="Usuarios " tabIcon="contact"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="Pedidos" tabBadge={{badgeSurtiendo}} tabIcon="cart"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Inventario" tabIcon="list-box"></ion-tab>\n</ion-tabs>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/tabs-controller/tabs-controller.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_5__angular_fire_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_6__angular_fire_auth__["AngularFireAuth"]])
    ], TabsControllerPage);
    return TabsControllerPage;
}());

//# sourceMappingURL=tabs-controller.js.map

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CalificacionesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_fire_database__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pedido_pd01_pedido_pd01__ = __webpack_require__(170);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the CalificacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CalificacionesPage = /** @class */ (function () {
    function CalificacionesPage(navCtrl, navParams, afAuth, afDb) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afAuth = afAuth;
        this.afDb = afDb;
        this.calificaciones = [];
        var idUser = this.afAuth.auth.currentUser.uid;
        this.afDb.list('pedidos/' + idUser).snapshotChanges().subscribe(function (data) {
            data.map(function (data) {
                var pedido = __assign({}, data.payload.val());
                var usuario = data.key;
                for (var key in pedido) {
                    if (pedido[key].hasOwnProperty('calificacion')) {
                        var color = '';
                        if (pedido[key]['calificacion']['estrellas'] > 3) {
                            color = 'verde';
                        }
                        else {
                            color = 'rojo';
                        }
                        _this.calificaciones.push(__assign({}, pedido[key], { color: color, key: key, usuario: usuario }));
                    }
                }
            });
            console.log(_this.calificaciones);
        });
    }
    CalificacionesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CalificacionesPage');
    };
    CalificacionesPage.prototype.detalleProducto = function (key, usuario) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pedido_pd01_pedido_pd01__["a" /* PedidoPD01Page */], { id: key, user: usuario });
    };
    CalificacionesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-calificaciones',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/calificaciones/calificaciones.html"*/'<!--\n  Generated template for the CalificacionesPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>calificaciones</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding style="background:url(assets/img/scwMSOdxSBK9V6qrlwRB_4.png) no-repeat center;background-size:cover;" id="page5">\n  <ion-list>\n    <ion-item *ngFor=\'let calificacion of calificaciones\' (tap)=\'detalleProducto(calificacion.key,calificacion.usuario)\'>\n      <div class="etiqueta {{calificacion.color}}"></div>\n      <ion-icon name="star" item-start class="icono"></ion-icon>\n      <h2>Pedido: {{calificacion.key}}</h2>\n      <h3>Comentario: {{calificacion.calificacion.comentario}}</h3>\n      <p>Estrellas: {{calificacion.calificacion.estrellas}}</p>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/calificaciones/calificaciones.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_fire_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_3__angular_fire_database__["AngularFireDatabase"]])
    ], CalificacionesPage);
    return CalificacionesPage;
}());

//# sourceMappingURL=calificaciones.js.map

/***/ }),

/***/ 236:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 236;

/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/calificaciones/calificaciones.module": [
		604,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 277;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PedidoPD05Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PedidoPD05Page = /** @class */ (function () {
    function PedidoPD05Page(navCtrl) {
        this.navCtrl = navCtrl;
    }
    PedidoPD05Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-pedido-pd05',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedido-pd05/pedido-pd05.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Pedido: PD-005\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding style="background:url(assets/img/uLat0LoFRjOEGlafEFXO_4.png) no-repeat center;background-size:cover;" id="page10">\n  <div class="spacer" style="width:748px;height:20px;" id="pedidoPD05-spacer20"></div>\n  <h1 id="pedidoPD05-heading10" style="color:#FFFFFF;font-weight:600;">\n    Usuario: Norberto Morales\n  </h1>\n  <div id="pedidoPD05-markdown4" class="show-list-numbers-and-dots">\n    <p style="color:#FFFFFF;font-size:30px;">\n      <strong>\n        Total:\n      </strong>\n      $165.00\n    </p>\n  </div>\n  <div class="spacer" style="width:748px;height:28px;" id="pedidoPD05-spacer21"></div>\n  <ion-list id="pedidoPD05-list9">\n    <ion-item-divider color="light" id="pedidoPD05-list-item-divider7">\n      Descripción del Pedido\n    </ion-item-divider>\n    <ion-item color="none" id="pedidoPD05-list-item30">\n      <ion-thumbnail item-left>\n        <img src="assets/img/NK2VAojcRQSuWwntQImJ_225796260dd4019.jpg" />\n      </ion-thumbnail>\n      <h2>\n        Jitomate Bola\n      </h2>\n    </ion-item>\n    <ion-item color="none" id="pedidoPD05-list-item31">\n      <ion-thumbnail item-left>\n        <img src="assets/img/1M09S4wpRumUx7hEh7RE_cebolla-roja_3335575.jpg" />\n      </ion-thumbnail>\n      <h2>\n        Cebolla Morada Grande\n      </h2>\n    </ion-item>\n    <ion-item color="none" id="pedidoPD05-list-item32">\n      <ion-thumbnail item-left>\n        <img src="assets/img/BtATKAcDQNeiGJXhxsTw_limon.jpg" />\n      </ion-thumbnail>\n      <h2>\n        Limon Sin Semilla\n      </h2>\n    </ion-item>\n    <ion-item color="none" id="pedidoPD05-list-item33">\n      <ion-thumbnail item-left>\n        <img src="assets/img/w87nx2ERZmC7UXPwrSzV_Ajo.png" />\n      </ion-thumbnail>\n      <h2>\n        Ajo\n      </h2>\n    </ion-item>\n  </ion-list>\n  <h2 id="pedidoPD05-heading11" style="color:#FFFFFF;font-weight:600;">\n    Datos de Envío\n  </h2>\n  <ion-list id="pedidoPD05-list10">\n    <ion-item-divider color="light" id="pedidoPD05-list-item-divider8">\n      Dirección de Cliente\n    </ion-item-divider>\n    <ion-item id="pedidoPD05-input15">\n      <ion-label>\n        Calle: Paseo del Altiplanicie #3 Local 5\n      </ion-label>\n      <ion-input type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="pedidoPD05-input16">\n      <ion-label>\n        Colonia: Villas de Irapuato\n      </ion-label>\n      <ion-input type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="pedidoPD05-input19">\n      <ion-label>\n        Teléfono: 462 - 195 - 8670\n      </ion-label>\n      <ion-input type="text" placeholder=""></ion-input>\n    </ion-item>\n  </ion-list>\n  <h2 id="pedidoPD05-heading12" style="color:#FFFFFF;font-weight:600;">\n    Estatus del Pedido\n  </h2>\n  <form id="pedidoPD05-form3">\n    <ion-item id="pedidoPD05-input18">\n      <ion-label>\n        Estatus: Enviado\n      </ion-label>\n      <ion-input type="text" placeholder=""></ion-input>\n    </ion-item>\n  </form>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/pedido-pd05/pedido-pd05.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], PedidoPD05Page);
    return PedidoPD05Page;
}());

//# sourceMappingURL=pedido-pd05.js.map

/***/ }),

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__alta_de_nuevo_producto_alta_de_nuevo_producto__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editar_informaci_ndel_producto_editar_informaci_ndel_producto__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tabs_controller_tabs_controller__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_fire_database__ = __webpack_require__(47);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginPage = /** @class */ (function () {
    function LoginPage(afAuth, afDb, navCtrl, alertCtrl, toastCtrl) {
        this.afAuth = afAuth;
        this.afDb = afDb;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.correo = "";
        this.password = "";
        /*this.afDb.database.ref("users").once("value").then(function(data){
          console.log(data.val());
        });*/
    }
    LoginPage.prototype.ingresar = function () {
        var _this = this;
        if (this.correo == "" || this.password == "") {
            var alert_1 = this.alertCtrl.create({
                title: 'Campos vacios',
                subTitle: 'Llene todos los campos por favor.',
                buttons: ['Ok']
            });
            alert_1.present();
        }
        else {
            this.afAuth.auth.signInWithEmailAndPassword(this.correo, this.password).then(function (data) {
            }).catch(function (error) {
                _this.presentAlert(error.code, error.message);
            });
        }
    };
    LoginPage.prototype.presentAlert = function (codigo, mensaje) {
        var toast = this.toastCtrl.create({
            message: 'El campo de email tiene que ser un texto valido, verifiquelo',
            position: 'bottom',
            duration: 2500,
            dismissOnPageChange: true
        });
        if (codigo == "auth/user-not-found") {
            var alert_2 = this.alertCtrl.create({
                title: 'El usuario no existe',
                subTitle: 'No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado.',
                buttons: ['Ok']
            });
            alert_2.present();
        }
        if (codigo == "auth/wrong-password") {
            var alert_3 = this.alertCtrl.create({
                title: 'Contraseña incorrecta',
                subTitle: 'La contraseña es invalida o el usuario no tiene contraseña.',
                buttons: ['Ok']
            });
            alert_3.present();
        }
        if (codigo == "auth/argument-error") {
            if (mensaje == 'signInWithEmailAndPassword failed: First argument "email" must be a valid string.') {
                toast.present();
            }
            else {
                toast = this.toastCtrl.create({
                    message: 'El campo de contraseña tiene que ser un texto valido, verifiquelo',
                    position: 'bottom',
                    duration: 2500,
                    dismissOnPageChange: true
                });
                toast.present();
            }
        }
        if (codigo == "auth/invalid-email") {
            toast = this.toastCtrl.create({
                message: 'El campo de email tiene un formato incorrecto',
                position: 'bottom',
                duration: 2500,
                dismissOnPageChange: true
            });
            toast.present();
        }
    };
    LoginPage.prototype.ingEnt = function (e) {
        if (e.keyCode == 13) {
            this.ingresar();
        }
    };
    LoginPage.prototype.goToInventario = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__tabs_controller_tabs_controller__["a" /* TabsControllerPage */]);
    };
    //Función para ir a la pantalla de nuevo producto. 
    LoginPage.prototype.goToAltaDeNuevoProducto = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__alta_de_nuevo_producto_alta_de_nuevo_producto__["a" /* AltaDeNuevoProductoPage */]);
    };
    //Función para ir a la pantalla de editar información del producto
    LoginPage.prototype.goToEditarInformaciNDelProducto = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__editar_informaci_ndel_producto_editar_informaci_ndel_producto__["a" /* EditarInformaciNDelProductoPage */]);
    };
    //Función para el login.
    LoginPage.prototype.login = function () {
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/login/login.html"*/'<!-- \n    Empresa:           Lex Software México S.A. de C.V.\n    Proyecto:          El Mandadito (Administrador).\n    Desarrollador:     Oscar Paolo Razo López.\n    Pantalla:          Login. (Inicio de Sesión de Usuarios).\n    Fecha de Creación: 20 de Octubre del 2018. \n\n    Historial de Modificaciones. \n\n    Fecha de Modificación | Líneas Modificadas | Programador / Desarrollador | Descripción de Modificación.\n\n  -->\n\n<ion-content padding style="background:url(assets/img/qTOJuq0lSn6ErL9zGdOx_4.png) no-repeat center;background-size:cover;" id="page6">\n  <!-- Espacio para separar logo del borde superior de la pantalla. -->\n  <div class="spacer" style="width:748px;height:18px;" id="login-spacer1"></div>\n\n  <!-- Imagen de logotipo de la aplicación. -->\n  <img src="assets/img/5JThhhqJRZOEdCG2I17n_mandaditowhite1.png" style="display:block;width:100%;height:auto;margin-left:auto;margin-right:auto;" />\n  \n  <!-- Espacio para separar logotipo de la aplicación e imagen de usuario. -->\n  <div class="spacer" style="width:748px;height:30px;" id="login-spacer2"></div>\n\n  <!-- Imagen de usuario para el login de la cuenta de Administrador. -->\n  <img src="assets/img/H8pkpQR2Q36cwWnEXEjj_user_icon-icons.com_66546.png" style="display:block;width:47%;height:auto;margin-left:auto;margin-right:auto;" />\n  \n  <!-- Label central con mensaje de bienvenida. -->\n  <h1 id="login-heading1" style="color:#FFFFFF;font-weight:600;text-align:center;">\n    Bienvenido\n  </h1>\n\n  <!-- Espacio entre mensaje central de bienvenida y campo para nombre del Administrador. -->\n  <div class="spacer" style="width:748px;height:33px;" id="login-spacer5"></div>\n  \n  <!-- Inicio del formulario. -->    \n    <!-- Caja de texto para el nombre del Administrador-->\n    <ion-item id="login-input_AdminName">\n      <ion-input [(ngModel)]="correo" type="email" placeholder="Usuario del Administrador"></ion-input>\n    </ion-item>\n    \n    <!-- Espacio entre campos. -->\n    <div class="spacer" style="width:748px;height:29px;" id="login-spacer3"></div>\n    \n    <!-- Caja de texto para el password del Administrador. -->\n    <ion-item id="login-input_AdminPassword">\n      <ion-input (keypress)="ingEnt($event)" [(ngModel)]="password" type="password" placeholder="Contraseña del Administrador"></ion-input>\n    </ion-item>\n  <!-- Fin del formulario de login. -->\n  \n  <!-- Espacio entre campo de password y botón de inicio de sesión. -->\n  <div class="spacer" style="width:748px;height:29px;" id="login-spacer4"></div>\n\n  <!-- Botón de inicio de sesión de login. -->\n  <!--<button id="BTN_IniciarSesionAdmin" name="BTN_IniciarSesionAdmin" ion-button color="energized" block style="font-weight:600;" on-click="goToInventario()">\n    Iniciar Sesión\n  </button>-->\n\n  <!-- Botón de inicio de sesión de login. -->\n  <button ion-button color="secondary" block style="font-weight:600;" (tap)="ingresar()">\n    Iniciar Sesión\n  </button>\n\n  <!-- Footer Label para derechos de autor. -->\n  <div class="spacer" style="width:748px;height:12px;" id="login-spacer5"></div>\n  <div id="login-markdown2" style="text-align:center;" class="show-list-numbers-and-dots">\n    <p style="color:#FFFFFF;">\n      <strong>\n        Lex Software S.A. de C.V.\n      </strong>\n      All Rights Reserved 2018\n    </p>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/login/login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__["AngularFireAuth"], __WEBPACK_IMPORTED_MODULE_6__angular_fire_database__["AngularFireDatabase"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditarInformaciNDelProductoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EditarInformaciNDelProductoPage = /** @class */ (function () {
    function EditarInformaciNDelProductoPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    EditarInformaciNDelProductoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-editar-informaci-ndel-producto',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/editar-informaci-ndel-producto/editar-informaci-ndel-producto.html"*/'<!-- \n    Empresa:           Lex Software México S.A. de C.V.\n    Proyecto:          El Mandadito (Administrador).\n    Desarrollador:     Oscar Paolo Razo López.\n    Pantalla:          Editar Información del Producto. (Inventario de Productos).\n    Fecha de Creación: 21 de Octubre del 2018. \n\n    Historial de Modificaciones. \n\n    Fecha de Modificación | Líneas Modificadas | Programador / Desarrollador | Descripción de Modificación.\n\n-->\n<!-- Cabecera de la ventana. -->\n<ion-header>\n  <ion-navbar> <!-- Botón de navegación. -->\n    <!-- Botón de retroceso de ventana. -->\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n\n    <!-- Título de la cabecera. -->\n    <ion-title>\n      Editar Producto\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<!-- Background de la pantalla. -->\n<ion-content padding style="background:url(assets/img/ydB4sxvZTquHPjqhrP52_4.png) no-repeat center;background-size:cover;" id="page8">\n  <!-- Espacio del borde superior y el texto de formulario. -->\n  <div class="spacer" style="width:748px;height:0px;" id="editarInformaciNDelProducto-spacer12"></div>\n  \n  <!-- Texto de cabecera. -->\n  <h1 id="editarInformaciNDelProducto-heading4" style="color:#FFFFFF;font-weight:600;">\n    Formulario de Información\n  </h1>\n\n  <!-- Espacio entre el texto y el formulario. -->\n  <div class="spacer" style="width:748px;height:23px;" id="editarInformaciNDelProducto-spacer13"></div>\n\n  <!-- Elemento cabecera de la lista. -->\n  <ion-list id="editarInformaciNDelProducto-list3">\n    <!-- Título de la lista de datos del producto. -->\n    <ion-item-divider color="light" id="editarInformaciNDelProducto-list-item-divider3">\n      Datos del Producto\n    </ion-item-divider>\n\n    <!-- Inicio del formulario. -->\n    <ion-item id="ITM_NombreProductoModif"> <!-- Nombre del producto. -->\n      <ion-label>\n        Nombre del Producto:\n      </ion-label>\n      <ion-input id="TXT_ModifNombreProd" name="TXT_ModifNombreProd" type="text" placeholder=" "></ion-input>\n    </ion-item>\n\n    <ion-item id="ITM_PrecioMayoreoModif"> <!-- Precio de Mayoreo del Producto. -->\n      <ion-label>\n        Precio de Mayoreo:\n      </ion-label>\n      <ion-input id="TXT_ModifPrecioMayoreo" name="TXT_ModifPrecioMayoreo" type="number" placeholder=""></ion-input>\n    </ion-item>\n\n    <ion-item id="ITM_PrecioMenudeoModif"> <!-- Precio de Menudeo del Producto. -->\n      <ion-label>\n        Precio Menudeo:\n      </ion-label>\n      <ion-input id="TXT_ModifPrecioMenudeo" name="TXT_ModifPrecioMenudeo" type="text" placeholder=""></ion-input>\n    </ion-item>\n\n    <ion-item id="ITM_CantidadProducto"> <!-- Cantidad de Producto. -->\n      <ion-label>\n        Cantidad:\n      </ion-label>\n      <ion-input id="" name="" type="text" placeholder="40"></ion-input>\n    </ion-item>\n    <ion-item id="editarInformaciNDelProducto-select3">\n      <ion-label>\n        Unidad\n      </ion-label>\n      <ion-select name="">\n        <ion-option>\n          Kg\n        </ion-option>\n        <ion-option>\n          Gramos (gr)\n        </ion-option>\n        <ion-option>\n          Kilogramos (Kg)\n        </ion-option>\n        <ion-option>\n          Pieza (Pza)\n        </ion-option>\n        <ion-option>\n          Manojo (Mjo)\n        </ion-option>\n        <ion-option>\n          Charola\n        </ion-option>\n        <ion-option>\n          Domo\n        </ion-option>\n        <ion-option>\n          Bolsa\n        </ion-option>\n        <ion-option>\n          Arpilla\n        </ion-option>\n      </ion-select>\n    </ion-item>\n    <ion-item id="editarInformaciNDelProducto-select4">\n      <ion-label>\n        Categoría de Producto\n      </ion-label>\n      <ion-select name="">\n        <ion-option>\n          Verduras\n        </ion-option>\n        <ion-option>\n          Frutas\n        </ion-option>\n        <ion-option>\n          Especias\n        </ion-option>\n        <ion-option>\n          Verduras\n        </ion-option>\n      </ion-select>\n    </ion-item>\n  </ion-list>\n  <div class="spacer" style="width:748px;height:45px;" id="editarInformaciNDelProducto-spacer14"></div>\n  <button id="editarInformaciNDelProducto-button6" ion-button color="energized" block style="font-weight:600;">\n    Cargar Fotografía del Producto\n  </button>\n  <div class="spacer" style="width:748px;height:165px;" id="editarInformaciNDelProducto-spacer15"></div>\n  <button id="editarInformaciNDelProducto-button7" ion-button color="balanced" block style="font-weight:600;">\n    Guardar Cambios\n  </button>\n  <button id="editarInformaciNDelProducto-button8" ion-button color="assertive" block style="font-weight:600;">\n    Descartar Cambios\n  </button>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/editar-informaci-ndel-producto/editar-informaci-ndel-producto.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], EditarInformaciNDelProductoPage);
    return EditarInformaciNDelProductoPage;
}());

//# sourceMappingURL=editar-informaci-ndel-producto.js.map

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsuariosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__perfil_de_cliente_perfil_de_cliente__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angularfire2_database__);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var UsuariosPage = /** @class */ (function () {
    function UsuariosPage(afAuth, afDb, navCtrl) {
        var _this = this;
        this.afAuth = afAuth;
        this.afDb = afDb;
        this.navCtrl = navCtrl;
        this.users = [];
        var userId = this.afAuth.auth.currentUser.uid;
        this.afDb.database.ref("admin/" + userId).once("value", function (data) {
            var ciudad = data.val()['nombre'];
            _this.afDb.list("users", function (ref) { return ref.orderByChild('ciudad').equalTo(ciudad); }).snapshotChanges().subscribe(function (data) {
                _this.users = data.map(function (data) { return (__assign({ key: data.key }, data.payload.val())); });
                console.log(_this.users);
            });
        });
    }
    UsuariosPage.prototype.goToPerfilDeCliente = function (key) {
        console.log(key);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__perfil_de_cliente_perfil_de_cliente__["a" /* PerfilDeClientePage */], { key: key });
    };
    UsuariosPage.prototype.salir = function () {
        this.afAuth.auth.signOut();
    };
    UsuariosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-usuarios',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/usuarios/usuarios.html"*/'<ion-content padding style="background:url(assets/img/scwMSOdxSBK9V6qrlwRB_4.png) no-repeat center;background-size:cover;" id="page5">\n  <div class="spacer" style="height:20px;" id="usuarios-spacer22"></div>\n  <h1 id="usuarios-heading13" style="color:#FFFFFF;font-weight:600;">\n    Mis Clientes\n  </h1>\n  <div class="spacer" style="width:748px;height:28px;" id="usuarios-spacer23"></div>\n  <ion-list id="usuarios-list11">\n    <ion-item-divider color="light" id="usuarios-list-item-divider9">\n      Listado de Clientes\n    </ion-item-divider>\n    <ion-item *ngFor="let user of users" color="none" (tap)="goToPerfilDeCliente(user.key)">\n      <ion-avatar item-left>\n        <img src={{user.url}} />\n      </ion-avatar>\n      <h2>\n        {{user.nom}} {{user.apPat}} {{user.apMat}}\n      </h2>\n    </ion-item>\n    \n  </ion-list>\n  <ion-fab right bottom (tap)="salir()">\n    <button ion-fab color="light"><ion-icon name="log-out"></ion-icon></button>\n  </ion-fab>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/usuarios/usuarios.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_fire_auth__["AngularFireAuth"], __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["AngularFireDatabase"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], UsuariosPage);
    return UsuariosPage;
}());

//# sourceMappingURL=usuarios.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PerfilDeClientePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_fire_database__ = __webpack_require__(47);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PerfilDeClientePage = /** @class */ (function () {
    function PerfilDeClientePage(navCtrl, navParams, afDb) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afDb = afDb;
        this.usuario = {};
        var userId = this.navParams.get('key');
        this.afDb.object("users/" + userId).snapshotChanges().subscribe(function (data) {
            _this.usuario = __assign({}, data.payload.val());
        });
    }
    PerfilDeClientePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-perfil-de-cliente',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/perfil-de-cliente/perfil-de-cliente.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Perfil del Cliente\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding style="background:url(assets/img/scwMSOdxSBK9V6qrlwRB_4.png) no-repeat center;background-size:cover;" id="page15">\n    <div class="spacer" style="width:300px;height:21px;" id="registrarse-spacer13"></div>\n    <div id="foto">\n      <img src={{usuario.url}} class="perfil" style="display:block;width:160px;height:160px;margin-left:auto;margin-right:auto;" />\n    </div>\n    <div class="spacer" style="width:300px;height:21px;" id="registrarse-spacer12"></div>\n    <ion-list id="registrarse-list4">\n      <ion-item-divider color="light" id="registrarse-list-item-divider5">\n        Datos de Usuario\n      </ion-item-divider>\n      <ion-item >\n        <ion-label ></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.nom" type="text" placeholder="Nombre"></ion-input>\n      </ion-item>\n      <ion-item >\n        <ion-label ></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.apPat" type="text" placeholder="Apellido Paterno"></ion-input>\n      </ion-item>\n      <ion-item >\n        <ion-label ></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.apMat" type="text" placeholder="Apellido Materno"></ion-input>\n      </ion-item>\n      <ion-item id="registrarse-input7">\n        <ion-label ></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.nomUsu" type="text" placeholder="Nombre de usuario"></ion-input>\n      </ion-item>\n      <ion-list radio-group [(ngModel)]="usuario.categoria">\n        <ion-item>\n          <ion-label>Particular</ion-label>\n          <ion-radio disabled value="particular" ></ion-radio>\n        </ion-item>\n        <ion-item>\n          <ion-label>Negocio</ion-label>\n          <ion-radio disabled value="negocio"></ion-radio>\n        </ion-item>\n      </ion-list>\n    </ion-list>\n    <div class="spacer" style="width:300px;height:24px;" id="registrarse-spacer14"></div>\n    <ion-item-divider color="light" id="registrarse-list-item-divider6">\n      Datos de Envío\n    </ion-item-divider>\n    <ion-item id="registrarse-input11">\n      <ion-label>\n        Nombre del Remitente\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.nomRem" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input10">\n      <ion-label>\n        Calle y número\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.calleNum" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input11">\n      <ion-label>\n        Colonia\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.colonia" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input12">\n      <ion-label>\n        Cuidad\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.ciudad" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input13">\n      <ion-label>\n        Estado\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.estado" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input14">\n      <ion-label>\n        Teléfono\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.telefono" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input15">\n      <ion-label>\n        Código postal\n      </ion-label>\n      <ion-input disabled [(ngModel)]="usuario.cp" type="text" placeholder=""></ion-input>\n    </ion-item>\n    <div class="spacer" style="width:300px;height:24px;" id="registrarse-spacer15"></div>\n    <ion-item-divider color="light" id="registrarse-list-item-divider7">\n      Datos Fiscales (Opcional)\n    </ion-item-divider>\n    <ion-item id="registrarse-input18">\n        <ion-label></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.nomFis" type="text" placeholder="Nombre o razón soical"></ion-input>\n      </ion-item>\n    <ion-item id="registrarse-input16">\n      <ion-label></ion-label>\n      <ion-input disabled [(ngModel)]="usuario.dirFis" type="text" placeholder="Dirección Fiscal"></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-input17">\n      <ion-label></ion-label>\n      <ion-input disabled [(ngModel)]="usuario.rfc" type="text" placeholder="RFC"></ion-input>\n    </ion-item>\n    <ion-item >\n        <ion-label></ion-label>\n        <ion-input disabled [(ngModel)]="usuario.correoFis" type="text" placeholder="correo electronico"></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-select3">\n      <ion-label>\n        Uso CFID\n      </ion-label>\n      <ion-select disabled [(ngModel)]="usuario.usoCFID" (ionChange)="especificarCFID($event)">\n        <ion-option >Otro</ion-option>\n        <ion-option>Por definir</ion-option>\n        <ion-option>Adquisición de mercancias</ion-option>\n        <ion-option>Gastos en general</ion-option>\n      </ion-select>\n    </ion-item>\n    <ion-item *ngIf="otro">\n      <ion-label>Especifique</ion-label>\n      <ion-input disabled [(ngModel)]="otroCFID" type="text"></ion-input>\n    </ion-item>\n    <ion-item id="registrarse-select4">\n      <ion-label>\n        Metodo de pago\n      </ion-label>\n      <ion-select disabled [(ngModel)]="usuario.MetPago" name="">\n        <ion-option>Transferencia bancaria</ion-option>\n        <ion-option>Pago con cheque nominativo</ion-option>\n        <ion-option>Pago en efectivo</ion-option>\n      </ion-select>\n    </ion-item>\n    <ion-list radio-group [(ngModel)]="opcion">\n      <ion-item>\n        <ion-label>Ocupo detalle de los productos</ion-label>\n        <ion-radio disabled value="detalle" ></ion-radio>\n      </ion-item>\n      <ion-item>\n        <ion-label>Puede facturarme cualquier producto</ion-label>\n        <ion-radio disabled value="factura"></ion-radio>\n      </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/perfil-de-cliente/perfil-de-cliente.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_fire_database__["AngularFireDatabase"]])
    ], PerfilDeClientePage);
    return PerfilDeClientePage;
}());

//# sourceMappingURL=perfil-de-cliente.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InventarioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__alta_de_nuevo_producto_alta_de_nuevo_producto__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angularfire2_database__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_storage__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_storage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angularfire2_storage__);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var InventarioPage = /** @class */ (function () {
    function InventarioPage(navCtrl, afDatabase, afAuth, alertCtrl, afStorage, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.afDatabase = afDatabase;
        this.afAuth = afAuth;
        this.alertCtrl = alertCtrl;
        this.afStorage = afStorage;
        this.loadingCtrl = loadingCtrl;
        this.productos = [];
        this.frut = [];
        this.verd = [];
        this.basic = [];
        this.categor = "frutas";
        var loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Cargando...'
        });
        loading.present();
        this.idUser = this.afAuth.auth.currentUser.uid;
        this.afDatabase.list("productos/" + this.idUser).snapshotChanges().subscribe(function (data) {
            _this.frut = [];
            _this.verd = [];
            _this.basic = [];
            _this.productos = data.map(function (data) {
                var producto = __assign({}, data.payload.val(), { key: data.key });
                switch (producto['categoPro']) {
                    case 'Frutas':
                        _this.frut.push(producto);
                        break;
                    case 'Verduras':
                        _this.verd.push(producto);
                        break;
                    case 'Basicos':
                        _this.basic.push(producto);
                        break;
                }
            });
            _this.frut.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                return 0;
            });
            _this.verd.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                return 0;
            });
            _this.basic.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                return 0;
            });
            loading.dismiss();
        });
    }
    InventarioPage.prototype.goToAltaDeNuevoProducto = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__alta_de_nuevo_producto_alta_de_nuevo_producto__["a" /* AltaDeNuevoProductoPage */]);
    };
    InventarioPage.prototype.goToEditarInformaciNDelProducto = function (key) {
        console.log(key);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__alta_de_nuevo_producto_alta_de_nuevo_producto__["a" /* AltaDeNuevoProductoPage */], {
            key: key
        });
    };
    InventarioPage.prototype.eliminar = function (key) {
        var _this = this;
        var confirmacion = this.alertCtrl.create({
            title: '¿Esta seguro?',
            message: 'Se borrara el producto de manera permanente y no se podra recuperar',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: function () {
                        _this.afDatabase.database.ref("productos/" + _this.idUser + "/" + key).remove();
                        _this.afStorage.ref('admin/' + _this.idUser + '/productos/' + key).delete().subscribe(function (data) {
                            console.log(data);
                        });
                    }
                }
            ]
        });
        confirmacion.present();
    };
    InventarioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-inventario',template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/inventario/inventario.html"*/'<ion-content >\n  <ion-card class="card">\n    <ion-card-header text-center class="header">\n      Lista de productos\n    </ion-card-header>\n    <ion-card-content class="cardCont">\n        <ion-list>\n            <div class="segmentos">\n                <ion-segment [(ngModel)]="categor">\n                    <ion-segment-button value="frutas">Frutas </ion-segment-button>\n                    <ion-segment-button value="verduras">Verduras</ion-segment-button>\n                    <ion-segment-button value="basicos">Basicos</ion-segment-button>\n                </ion-segment>\n            </div>\n            <div [ngSwitch]="categor">\n                <div *ngSwitchCase="\'frutas\'">\n                  <ion-item-sliding *ngFor="let frutas of frut">\n                    <ion-item class="itemList"  (tap)="goToEditarInformaciNDelProducto(frutas.key)">\n                      <ion-avatar item-start class="avatar">\n                        <img src={{frutas.url}}>\n                      </ion-avatar>\n                      <h2>{{frutas.nombre}}</h2>\n                    </ion-item>\n                    <ion-item-options side="left">\n                      <button ion-button color="danger" (tap)="eliminar(frutas.key)">\n                        <ion-icon name="trash"></ion-icon>\n                        Eliminar\n                      </button>\n                    </ion-item-options>\n                  </ion-item-sliding> \n                </div>\n                <div *ngSwitchCase="\'verduras\'">\n                    <ion-item-sliding *ngFor="let verduras of verd">\n                      <ion-item class="itemList"  (tap)="goToEditarInformaciNDelProducto(verduras.key)">\n                        <ion-avatar item-start class="avatar">\n                          <img src={{verduras.url}}>\n                        </ion-avatar>\n                        <h2>{{verduras.nombre}}</h2>\n                      </ion-item>\n                      <ion-item-options side="left">\n                        <button ion-button color="danger" (tap)="eliminar(verduras.key)">\n                          <ion-icon name="trash"></ion-icon>\n                          Eliminar\n                        </button>\n                      </ion-item-options>\n                    </ion-item-sliding> \n                  </div>\n                  <div *ngSwitchCase="\'basicos\'">\n                      <ion-item-sliding *ngFor="let basicos of basic">\n                        <ion-item class="itemList"  (tap)="goToEditarInformaciNDelProducto(basicos.key)">\n                          <ion-avatar item-start class="avatar">\n                            <img src={{basicos.url}}>\n                          </ion-avatar>\n                          <h2>{{basicos.nombre}}</h2>\n                        </ion-item>\n                        <ion-item-options side="left">\n                          <button ion-button color="danger" (tap)="eliminar(basicos.key)">\n                            <ion-icon name="trash"></ion-icon>\n                            Eliminar\n                          </button>\n                        </ion-item-options>\n                      </ion-item-sliding> \n                    </div>\n            </div>\n               \n        </ion-list>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-fab bottom right>\n      <button ion-fab (tap)="goToAltaDeNuevoProducto()"><ion-icon name="add"></ion-icon></button>\n  </ion-fab>\n</ion-content>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/pages/inventario/inventario.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_storage__["AngularFireStorage"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]])
    ], InventarioPage);
    return InventarioPage;
}());

//# sourceMappingURL=inventario.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PushnotificationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__ = __webpack_require__(173);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var PushnotificationProvider = /** @class */ (function () {
    function PushnotificationProvider(oneSignal) {
        this.oneSignal = oneSignal;
        console.log('Hello PushnotificationProvider Provider');
    }
    PushnotificationProvider.prototype.initOneSingal = function () {
        this.oneSignal.startInit('ed113f7f-9310-4b35-a774-332cbd72d05c', '937762778096');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(function () {
            console.log('Notificacion recibida');
        });
        this.oneSignal.handleNotificationOpened().subscribe(function () {
            console.log('Notificacion abierta');
        });
        this.oneSignal.endInit();
    };
    PushnotificationProvider.prototype.obtenerId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var claves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.oneSignal.getIds()];
                    case 1:
                        claves = _a.sent();
                        return [2 /*return*/, claves];
                }
            });
        });
    };
    PushnotificationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__["a" /* OneSignal */]])
    ], PushnotificationProvider);
    return PushnotificationProvider;
}());

//# sourceMappingURL=pushnotification.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(487);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export firebaseConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_pedidos_pedidos__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_inventario_inventario__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_tabs_controller_tabs_controller__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_usuarios_usuarios__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_login_login__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_alta_de_nuevo_producto_alta_de_nuevo_producto__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_editar_informaci_ndel_producto_editar_informaci_ndel_producto__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_pedido_pd01_pedido_pd01__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_pedido_pd05_pedido_pd05__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_perfil_de_cliente_perfil_de_cliente__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_calificaciones_calificaciones__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_status_bar__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_splash_screen__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__angular_fire__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__angular_fire_database__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__angular_fire_storage__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_camera__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_bluetooth_serial__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_onesignal__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__providers_pushnotification_pushnotification__ = __webpack_require__(353);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

























var firebaseConfig = {
    apiKey: "AIzaSyAjaKKjMcn8qxiOl_AppnpbKBwucm9vzCw",
    authDomain: "aptito-71e75.firebaseapp.com",
    databaseURL: "https://aptito-71e75.firebaseio.com",
    projectId: "aptito-71e75",
    storageBucket: "aptito-71e75.appspot.com",
    messagingSenderId: "937762778096"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_pedidos_pedidos__["a" /* PedidosPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_inventario_inventario__["a" /* InventarioPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_tabs_controller_tabs_controller__["a" /* TabsControllerPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_usuarios_usuarios__["a" /* UsuariosPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_alta_de_nuevo_producto_alta_de_nuevo_producto__["a" /* AltaDeNuevoProductoPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_editar_informaci_ndel_producto_editar_informaci_ndel_producto__["a" /* EditarInformaciNDelProductoPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_pedido_pd01_pedido_pd01__["a" /* PedidoPD01Page */],
                __WEBPACK_IMPORTED_MODULE_12__pages_pedido_pd05_pedido_pd05__["a" /* PedidoPD05Page */],
                __WEBPACK_IMPORTED_MODULE_13__pages_perfil_de_cliente_perfil_de_cliente__["a" /* PerfilDeClientePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_calificaciones_calificaciones__["a" /* CalificacionesPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/calificaciones/calificaciones.module#CalificacionesPageModule', name: 'CalificacionesPage', segment: 'calificaciones', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_17__angular_fire__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_18__angular_fire_database__["AngularFireDatabaseModule"],
                __WEBPACK_IMPORTED_MODULE_19__angular_fire_auth__["AngularFireAuthModule"],
                __WEBPACK_IMPORTED_MODULE_20__angular_fire_storage__["AngularFireStorageModule"],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_pedidos_pedidos__["a" /* PedidosPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_inventario_inventario__["a" /* InventarioPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_tabs_controller_tabs_controller__["a" /* TabsControllerPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_usuarios_usuarios__["a" /* UsuariosPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_alta_de_nuevo_producto_alta_de_nuevo_producto__["a" /* AltaDeNuevoProductoPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_editar_informaci_ndel_producto_editar_informaci_ndel_producto__["a" /* EditarInformaciNDelProductoPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_pedido_pd01_pedido_pd01__["a" /* PedidoPD01Page */],
                __WEBPACK_IMPORTED_MODULE_12__pages_pedido_pd05_pedido_pd05__["a" /* PedidoPD05Page */],
                __WEBPACK_IMPORTED_MODULE_13__pages_perfil_de_cliente_perfil_de_cliente__["a" /* PerfilDeClientePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_calificaciones_calificaciones__["a" /* CalificacionesPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_18__angular_fire_database__["AngularFireDatabase"],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_bluetooth_serial__["a" /* BluetoothSerial */],
                __WEBPACK_IMPORTED_MODULE_23__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_24__providers_pushnotification_pushnotification__["a" /* PushnotificationProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2_database___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_angularfire2_database__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_controller_tabs_controller__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_calificaciones_calificaciones__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_pushnotification_pushnotification__ = __webpack_require__(353);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};










var MyApp = /** @class */ (function () {
    function MyApp(afDb, afAuth, platform, statusBar, splashScreen, pushProvider) {
        var _this = this;
        this.afDb = afDb;
        this.afAuth = afAuth;
        this.statusBar = statusBar;
        this.pushProvider = pushProvider;
        this.rootPage = "";
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.overlaysWebView(true);
            _this.statusBar.styleDefault();
            splashScreen.hide();
            _this.afAuth.authState.subscribe(function (user) {
                if (user) {
                    _this.afDb.database.ref("admin/" + user.uid).once("value").then(function (data) {
                        if (data.val() != null) {
                            _this.notificacionesId(user.uid);
                            _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_tabs_controller_tabs_controller__["a" /* TabsControllerPage */];
                        }
                        else {
                            _this.afAuth.auth.signOut();
                        }
                    });
                }
                else {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
                }
            });
        });
    }
    MyApp.prototype.goCalificacion = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__pages_calificaciones_calificaciones__["a" /* CalificacionesPage */]);
    };
    MyApp.prototype.notificacionesId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var playerID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('hola');
                        this.pushProvider.initOneSingal();
                        return [4 /*yield*/, this.pushProvider.obtenerId()];
                    case 1:
                        playerID = _a.sent();
                        this.afDb.database.ref('admin/' + id).update(playerID);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
    ], MyApp.prototype, "navCtrl", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/app/app.html"*/'<ion-menu [content]="mainContent">\n  <ion-content id="side-menu21">\n    <div class="spacer" style="width:716px;height:49px;" id="menu-spacer11"></div>\n    <img src="assets/img/lAoClfoGS6yd8oOlMDt7_mandadito1.png" style="display:block;width:60%;height:auto;margin-left:auto;margin-right:auto;" />\n    <div class="spacer" style="width:716px;height:49px;" id="menu-spacer25"></div>\n    <button  ion-button block color="positive" menuClose="" style="font-weight:600;" (click)="goCalificacion()">\n      Calificaciones\n  </button>\n    <button id="menu-button11" ion-button color="positive" block style="font-weight:600;" href="mailto:soporte@lexsoftware.net">\n      Soporte Técnico\n    </button>\n    <div class="spacer" style="width:716px;height:652px;" id="menu-spacer28"></div>\n    <div id="menu-markdown5" style="text-align:center;" class="show-list-numbers-and-dots">\n      <p style="color:#000000;">\n        <strong>\n          Lex Software S.A. de C.V.\n        </strong>\n        All Rights Reserved 2018\n      </p>\n    </div>\n  </ion-content>\n</ion-menu>\n\n<ion-nav #mainContent [root]="rootPage"></ion-nav>'/*ion-inline-end:"/Users/lexsoftware/Desktop/achivos/codigoFuente/Administrator/ElMandadito/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6_angularfire2_database__["AngularFireDatabase"],
            __WEBPACK_IMPORTED_MODULE_5__angular_fire_auth__["AngularFireAuth"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_9__providers_pushnotification_pushnotification__["a" /* PushnotificationProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[354]);
//# sourceMappingURL=main.js.map