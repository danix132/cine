"use strict";

function testCreateBoleto() {
  var loginResponse, loginData, token, userId, funcionesResponse, funciones, funcionId, salaId, asientosResponse, salaData, asientos, asientoId, boletoData, boletoResponse, boletoResult;
  return regeneratorRuntime.async(function testCreateBoleto$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('🧪 Probando creación de boleto...'); // Primero, intentar hacer login para obtener el token

          _context.next = 4;
          return regeneratorRuntime.awrap(fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'admin@example.com',
              password: '123456'
            })
          }));

        case 4:
          loginResponse = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(loginResponse.json());

        case 7:
          loginData = _context.sent;
          console.log('✅ Login response:', loginData);

          if (!(!loginData.token || !loginData.user)) {
            _context.next = 12;
            break;
          }

          console.log('❌ Login failed:', loginData);
          return _context.abrupt("return");

        case 12:
          token = loginData.token;
          userId = loginData.user.id;
          console.log('Token:', token.substring(0, 20) + '...');
          console.log('User ID:', userId); // Obtener una función disponible

          _context.next = 18;
          return regeneratorRuntime.awrap(fetch('http://localhost:3000/api/funciones', {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 18:
          funcionesResponse = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(funcionesResponse.json());

        case 21:
          funciones = _context.sent;

          if (!(funciones.length === 0)) {
            _context.next = 25;
            break;
          }

          console.log('❌ No hay funciones disponibles');
          return _context.abrupt("return");

        case 25:
          funcionId = funciones[0].id;
          console.log('Función seleccionada:', funcionId); // Obtener asientos de la sala

          salaId = funciones[0].salaId;
          _context.next = 30;
          return regeneratorRuntime.awrap(fetch("http://localhost:3000/api/salas/".concat(salaId), {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 30:
          asientosResponse = _context.sent;
          _context.next = 33;
          return regeneratorRuntime.awrap(asientosResponse.json());

        case 33:
          salaData = _context.sent;
          asientos = salaData.asientos;

          if (!(asientos.length === 0)) {
            _context.next = 38;
            break;
          }

          console.log('❌ No hay asientos disponibles');
          return _context.abrupt("return");

        case 38:
          asientoId = asientos[0].id;
          console.log('Asiento seleccionado:', asientoId); // Crear boleto

          boletoData = {
            funcionId: funcionId,
            asientoId: asientoId,
            usuarioId: userId,
            estado: 'PAGADO'
          };
          console.log('📤 Enviando datos de boleto:', boletoData);
          _context.next = 44;
          return regeneratorRuntime.awrap(fetch('http://localhost:3000/api/boletos', {
            method: 'POST',
            headers: {
              Authorization: "Bearer ".concat(token),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(boletoData)
          }));

        case 44:
          boletoResponse = _context.sent;
          _context.next = 47;
          return regeneratorRuntime.awrap(boletoResponse.json());

        case 47:
          boletoResult = _context.sent;

          if (boletoResponse.ok) {
            console.log('✅ Boleto creado exitosamente:', boletoResult);
          } else {
            console.error('❌ Error al crear boleto:', boletoResult);
          }

          _context.next = 54;
          break;

        case 51:
          _context.prev = 51;
          _context.t0 = _context["catch"](0);
          console.error('❌ Error en test:', _context.t0.message);

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 51]]);
}

testCreateBoleto();