"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
exports.ValidarBoletosComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../../../environments/environment");
var jsqr_1 = require("jsqr");
var ValidarBoletosComponent = /** @class */ (function () {
    function ValidarBoletosComponent(router, http, authService) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.camaraActiva = false;
        this.stream = null;
        this.ultimoEscaneo = '';
        this.procesando = false;
        // Estados de validación
        this.boleto = null;
        this.mensaje = '';
        this.tipoMensaje = 'info';
        this.mostrarResultado = false;
        // Historial de escaneos
        this.historial = [];
    }
    ValidarBoletosComponent.prototype.ngOnInit = function () {
        this.iniciarCamara();
    };
    ValidarBoletosComponent.prototype.ngOnDestroy = function () {
        this.detenerCamara();
    };
    ValidarBoletosComponent.prototype.iniciarCamara = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, video, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // Solicitar permisos de cámara
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                video: { facingMode: 'environment' } // Usar cámara trasera en móviles
                            })];
                    case 1:
                        // Solicitar permisos de cámara
                        _a.stream = _b.sent();
                        video = document.getElementById('qr-video');
                        if (video) {
                            video.srcObject = this.stream;
                            video.play();
                            this.camaraActiva = true;
                            this.iniciarDeteccion();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error al acceder a la cámara:', error_1);
                        this.mensaje = 'No se pudo acceder a la cámara. Verifica los permisos.';
                        this.tipoMensaje = 'error';
                        this.mostrarResultado = true;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ValidarBoletosComponent.prototype.detenerCamara = function () {
        if (this.stream) {
            this.stream.getTracks().forEach(function (track) { return track.stop(); });
            this.stream = null;
            this.camaraActiva = false;
        }
    };
    ValidarBoletosComponent.prototype.iniciarDeteccion = function () {
        var _this = this;
        // Usar canvas para capturar frames del video y detectar QR
        var video = document.getElementById('qr-video');
        var canvas = document.getElementById('qr-canvas');
        if (!video || !canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var escanear = function () {
            // No escanear si está procesando o mostrando resultado
            if (!_this.camaraActiva || _this.procesando || _this.mostrarResultado) {
                if (_this.camaraActiva) {
                    requestAnimationFrame(escanear);
                }
                return;
            }
            // Configurar el tamaño del canvas según el video
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                // Capturar frame del video
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Obtener los datos de la imagen
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                // Intentar detectar código QR con jsQR
                var code = jsqr_1["default"](imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert'
                });
                if (code && code.data) {
                    console.log('🎯 QR detectado:', code.data);
                    _this.escanearManual(code.data);
                }
            }
            requestAnimationFrame(escanear);
        };
        escanear();
    };
    // Método alternativo: escaneo manual
    ValidarBoletosComponent.prototype.escanearManual = function (codigoQR) {
        if (!codigoQR || codigoQR.trim() === '') {
            return;
        }
        if (codigoQR === this.ultimoEscaneo) {
            return; // Evitar escaneos duplicados
        }
        this.ultimoEscaneo = codigoQR;
        this.validarBoleto(codigoQR);
    };
    ValidarBoletosComponent.prototype.validarBoleto = function (codigoQR) {
        var _this = this;
        if (this.procesando)
            return;
        this.procesando = true;
        this.mostrarResultado = false;
        this.mensaje = 'Validando boleto...';
        this.tipoMensaje = 'info';
        var token = this.authService.getToken();
        if (!token) {
            this.procesando = false;
            this.mensaje = 'No estás autenticado';
            this.tipoMensaje = 'error';
            this.mostrarResultado = true;
            return;
        }
        var headers = {
            'Authorization': "Bearer " + token
        };
        this.http.get(environment_1.environment.apiUrl + "/boletos/validar/" + codigoQR, { headers: headers }).subscribe({
            next: function (boleto) {
                _this.boleto = boleto;
                if (boleto.estado === 'PAGADO') {
                    _this.mensaje = '✓ Boleto válido - Puede ingresar';
                    _this.tipoMensaje = 'success';
                    _this.agregarAlHistorial(codigoQR, boleto.estado, 'valido');
                    // Reproducir sonido de éxito
                    _this.reproducirSonido('success');
                }
                else if (boleto.estado === 'CANCELADO') {
                    _this.mensaje = '✗ Boleto cancelado - No puede ingresar';
                    _this.tipoMensaje = 'error';
                    _this.agregarAlHistorial(codigoQR, boleto.estado, 'invalido');
                    _this.reproducirSonido('error');
                }
                else {
                    _this.mensaje = '⚠ Boleto no pagado - Verificar en taquilla';
                    _this.tipoMensaje = 'error';
                    _this.agregarAlHistorial(codigoQR, boleto.estado, 'invalido');
                    _this.reproducirSonido('error');
                }
                _this.mostrarResultado = true;
                _this.procesando = false;
                // NO limpiar automáticamente - esperar a que usuario presione "Escanear Nuevo"
            },
            error: function (error) {
                var _a;
                console.error('Error al validar boleto:', error);
                _this.boleto = null;
                // Verificar tipo de error
                if (error.status === 404) {
                    _this.mensaje = '✗ Código QR no válido';
                    _this.agregarAlHistorial(codigoQR, 'NO_ENCONTRADO', 'invalido');
                }
                else if (error.status === 400) {
                    // Error 400 es cuando el boleto ya fue validado o no está pagado
                    var errorMsg = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Boleto no válido';
                    _this.mensaje = '⚠️ ' + errorMsg;
                    // Si el mensaje contiene "ya fue validado", es un boleto usado
                    if (errorMsg.toLowerCase().includes('ya fue validado')) {
                        _this.agregarAlHistorial(codigoQR, 'YA_VALIDADO', 'usado');
                    }
                    else {
                        _this.agregarAlHistorial(codigoQR, 'NO_VALIDO', 'invalido');
                    }
                }
                else {
                    _this.mensaje = '✗ Error al validar el boleto';
                    _this.agregarAlHistorial(codigoQR, 'ERROR', 'invalido');
                }
                _this.tipoMensaje = 'error';
                _this.mostrarResultado = true;
                _this.procesando = false;
                _this.reproducirSonido('error');
                // NO limpiar automáticamente - esperar a que usuario presione "Escanear Nuevo"
            }
        });
    };
    ValidarBoletosComponent.prototype.agregarAlHistorial = function (codigoQR, estado, resultado) {
        this.historial.unshift({
            codigoQR: codigoQR,
            timestamp: new Date(),
            estado: estado,
            resultado: resultado
        });
        // Mantener solo los últimos 10
        if (this.historial.length > 10) {
            this.historial = this.historial.slice(0, 10);
        }
    };
    ValidarBoletosComponent.prototype.limpiarResultado = function () {
        this.mostrarResultado = false;
        this.boleto = null;
        this.mensaje = '';
        this.ultimoEscaneo = '';
    };
    ValidarBoletosComponent.prototype.escanearNuevo = function () {
        // Limpiar resultado y permitir nuevo escaneo
        this.limpiarResultado();
    };
    ValidarBoletosComponent.prototype.reproducirSonido = function (tipo) {
        // Crear un beep usando Web Audio API
        var audioContext = new AudioContext();
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        if (tipo === 'success') {
            oscillator.frequency.value = 800; // Frecuencia alta para éxito
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        }
        else {
            oscillator.frequency.value = 200; // Frecuencia baja para error
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    };
    ValidarBoletosComponent.prototype.volver = function () {
        this.detenerCamara();
        this.router.navigate(['/vendedor']);
    };
    ValidarBoletosComponent.prototype.toggleCamara = function () {
        if (this.camaraActiva) {
            this.detenerCamara();
        }
        else {
            this.iniciarCamara();
        }
    };
    ValidarBoletosComponent = __decorate([
        core_1.Component({
            selector: 'app-validar-boletos',
            standalone: true,
            imports: [common_1.CommonModule, http_1.HttpClientModule],
            templateUrl: './validar-boletos.component.html',
            styleUrls: ['./validar-boletos.component.scss']
        })
    ], ValidarBoletosComponent);
    return ValidarBoletosComponent;
}());
exports.ValidarBoletosComponent = ValidarBoletosComponent;
