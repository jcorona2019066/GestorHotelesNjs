'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioShema = Schema({
    nombres: String,
    apellidos: String,
    password: String,
    usuario: String,
    edad: Number,
    email: String,
    telefono: Number,
    rol: String,
    imagen: String,
    hotel: {type: Schema.Types.ObjectId, ref:"hoteles"}
})

module.exports = mongoose.model("usuario", UsuarioShema);