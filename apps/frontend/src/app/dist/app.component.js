"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var AppComponent = /** @class */ (function () {
    function AppComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.title = 'Cine App';
        this.currentUser = null;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.currentUser$.subscribe(function (user) {
            _this.currentUser = user;
        });
    };
    AppComponent.prototype.logout = function () {
        this.authService.logout();
        this.router.navigate(['/login']);
    };
    AppComponent.prototype.isAuthenticated = function () {
        return this.authService.isAuthenticated();
    };
    AppComponent.prototype.isAdmin = function () {
        return this.authService.isAdmin();
    };
    AppComponent.prototype.isVendedor = function () {
        return this.authService.isVendedor();
    };
    AppComponent.prototype.isCliente = function () {
        return this.authService.isCliente();
    };
    AppComponent.prototype.navigateToAdminPanel = function () {
        if (this.isAdmin()) {
            this.router.navigate(['/admin']);
        }
        else if (this.isVendedor()) {
            this.router.navigate(['/reportes']);
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            standalone: true,
            imports: [router_1.RouterOutlet, common_1.CommonModule, router_1.RouterLink],
            templateUrl: './app.component.html',
            styleUrl: './app.component.scss'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
