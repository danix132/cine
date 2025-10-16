"use strict";
exports.__esModule = true;
exports.appConfig = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var platform_browser_1 = require("@angular/platform-browser");
var app_routes_1 = require("./app.routes");
var auth_interceptor_1 = require("./interceptors/auth.interceptor");
exports.appConfig = {
    providers: [
        core_1.provideZoneChangeDetection({ eventCoalescing: true }),
        router_1.provideRouter(app_routes_1.routes),
        platform_browser_1.provideClientHydration(),
        http_1.provideHttpClient(http_1.withFetch(), http_1.withInterceptors([auth_interceptor_1.AuthInterceptor]))
    ]
};
