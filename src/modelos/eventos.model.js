'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    nombre: String,
    fecha: Date,
    hotel: {type:Schema.Types.ObjectId, ref:"hoteles"}
})

module.exports = mongoose.model("evento",EventoSchema);