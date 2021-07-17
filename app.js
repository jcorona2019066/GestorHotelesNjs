'use strict'


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

var usuario_ruta = require("./src/rutas/usuario.ruta");
var hotel_ruta = require("./src/rutas/hotel.ruta")
var admin_ruta = require("./src/rutas/admin.ruta")
var servicio_ruta = require("./src/rutas/servicio.ruta")
var factura_ruta = require("./src/rutas/factura.ruta")


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors());


app.use('/api', usuario_ruta,hotel_ruta,admin_ruta,servicio_ruta,factura_ruta);


module.exports = app