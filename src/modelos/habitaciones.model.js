'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HabitacionesSchema = Schema({
    nombre: String,
    precio: Number,
    tipo: String,
    img: String,
    estado: String,
    hotel: {type: Schema.Types.ObjectId, ref:"hoteles"}
})

module.exports = mongoose.model("habitaciones",HabitacionesSchema);