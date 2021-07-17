"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta:IN6AV";

exports.createToken = function(usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombres,
        username: usuario.usuario,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix()
    }

    return jwt.encode(payload, secret);    
}