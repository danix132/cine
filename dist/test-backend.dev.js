"use strict";

// Script simple para probar el endpoint del backend
var http = require('http'); // Datos de prueba para el endpoint


var testData = {
  metodoPago: 'EFECTIVO',
  datosPersonales: {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '123456789'
  },
  aceptaTerminos: true
}; // Configurar la petición

var options = {
  hostname: 'localhost',
  port: 3000,
  path: '/pedidos/procesar-carrito/test-user-id',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fake-token-for-testing' // Token falso para pruebas

  }
};
var req = http.request(options, function (res) {
  console.log("Status: ".concat(res.statusCode));
  console.log("Headers:", res.headers);
  var data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function () {
    console.log('Response:', data);
  });
});
req.on('error', function (error) {
  console.error('Error:', error.message);
}); // Enviar los datos

req.write(JSON.stringify(testData));
req.end();