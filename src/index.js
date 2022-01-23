const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');


const app = express();
// usando el metodo cretae server para crear un servidor http de la app
const server = http.createServer(app);
//obteniendo la conexion de web sockets
const io = socketio(server);

//configurando el puerto obtenido de las variables de enetorno
app.set('port', process.env.PORT || 3000);
//llamando a la funcion de sockets.js
require('./sockets')(io);

//envaindo archivos estaticos, usando path para obtener la ruta de archivos
app.use(express.static(path.join(__dirname, 'public')));

// empezando el servidor
server.listen(3000, () => {
    console.log('serverPort: 3000');
});