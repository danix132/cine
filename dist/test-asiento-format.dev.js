"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Test script para debuggear el formato de asientos
// Ejecutar en la consola del navegador cuando estés en la página de selección de asientos
console.log('=== TEST FORMATO ASIENTOS ==='); // Simular lo que hace el frontend

function testAsientoFormat() {
  var funcionId = 'func-123-ejemplo';
  var asientosSeleccionados = ['1-5', '1-6', '2-3']; // Formato típico del frontend

  console.log('Función ID:', funcionId);
  console.log('Asientos seleccionados:', asientosSeleccionados); // Simular el procesamiento que hace el frontend

  var itemsToSend = asientosSeleccionados.map(function (asientoId) {
    var _asientoId$split = asientoId.split('-'),
        _asientoId$split2 = _slicedToArray(_asientoId$split, 2),
        fila = _asientoId$split2[0],
        numero = _asientoId$split2[1];

    var referenciaId = "".concat(funcionId, "-").concat(fila, "-").concat(numero);
    var request = {
      tipo: 'BOLETO',
      referenciaId: referenciaId,
      cantidad: 1,
      precioUnitario: 150
    };
    console.log("Asiento: ".concat(asientoId, " \u2192 ReferenciaId: ").concat(referenciaId));
    console.log('Request completo:', request);
    return request;
  });
  console.log('Items finales a enviar:', itemsToSend); // Simular lo que hace el backend

  console.log('\n=== SIMULACIÓN BACKEND ===');
  itemsToSend.forEach(function (item, index) {
    console.log("\nProcessando item ".concat(index + 1, ":"));
    console.log('ReferenciaId recibido:', item.referenciaId);
    var parts = item.referenciaId.split('-');
    console.log('Parts después de split:', parts, 'length:', parts.length);

    if (parts.length !== 3) {
      console.error('❌ ERROR: Se esperaban 3 partes, se recibieron:', parts.length);
      console.error('❌ FORMATO INVÁLIDO');
    } else {
      var funcionIdParsed = parts[0];
      var filaParsed = parseInt(parts[1]);
      var numeroParsed = parseInt(parts[2]);
      console.log('✅ Parseado correctamente:');
      console.log('  - FunciónId:', funcionIdParsed);
      console.log('  - Fila:', filaParsed);
      console.log('  - Número:', numeroParsed);

      if (isNaN(filaParsed) || isNaN(numeroParsed)) {
        console.error('❌ ERROR: fila o numero no son números válidos');
      } else {
        console.log('✅ Formato válido');
      }
    }
  });
} // Ejecutar el test


testAsientoFormat();
console.log('\n=== INSTRUCCIONES ===');
console.log('1. Copia y pega este código en la consola del navegador');
console.log('2. Compara con lo que realmente envía tu aplicación');
console.log('3. Si hay diferencias, revisa el código del frontend');