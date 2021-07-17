'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HotelesSchema = Schema({
    nombre: String,
    direccion: String,
    descripcion: String,
    hospedados: Number,
})

module.exports = mongoose.model("hoteles",HotelesSchema);