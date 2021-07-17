'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ServiciosSchema = Schema({
    nombre: String,
    precio: Number,
    habitacion: {type:Schema.Types.ObjectId, ref: "habitaciones"},
    usuario: { type:Schema.Types.ObjectId, ref: "usuario"},
})

module.exports = mongoose.model("servicios",ServiciosSchema);