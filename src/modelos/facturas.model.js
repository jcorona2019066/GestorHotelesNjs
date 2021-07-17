'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FacturasSchema = Schema({
    //usuario: {type: Schema.Types.String, ref:"usuario"},
   // habitacion: {type: Schema.Types.String, ref:"habitacion"},

    servicios: {type: Schema.Types.ObjectId, ref:"servicios"},
    reservacion:{type: Schema.Types.ObjectId, ref:"reservaciones"},
    total: Number,
})

module.exports = mongoose.model("factura",FacturasSchema);