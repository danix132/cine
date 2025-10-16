"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePeliculaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_pelicula_dto_1 = require("./create-pelicula.dto");
class UpdatePeliculaDto extends (0, swagger_1.PartialType)(create_pelicula_dto_1.CreatePeliculaDto) {
}
exports.UpdatePeliculaDto = UpdatePeliculaDto;
//# sourceMappingURL=update-pelicula.dto.js.map