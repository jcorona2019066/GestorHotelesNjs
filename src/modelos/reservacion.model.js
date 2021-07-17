'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ReservacionSchema = Schema({
    fechaInicio: Date,
    fechaFinal: Date,
    precio: Number,
    cantidad: String,
    habitacion:{type: Schema.Types.ObjectId, ref:"habitaciones"},
    usuario: {type: Schema.Types.ObjectId, ref:"usuario"}
})
module.exports = mongoose.model("reservacion",ReservacionSchema);