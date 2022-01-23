module.exports = function(io) {
    //variable en memoria para guardar nombre de usuarios
    let nicknames = [];

    io.on('connection', socket => {
        console.log('Nuevo usuario conectado');
        socket.on('new user', (data, cb) => {
            console.log(data);
            //validando que el usuario no se haya creado previamente y este en nicknames ni tampoco sea vacío
            if (nicknames.indexOf(data) != -1 || data === '') {
                //mandamos false para mostrar error
                cb(false,'');
            } else {
                //mandamos true para mostrar la parte del chat
                cb(true);
                socket.nickname = data;
                nicknames.push(socket.nickname);
                actualizaUsuarios();
            }
        });
        //recibiendo el mensaje y transmitirlo a todos lados
        socket.on('send message', data => {
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            });
        });

        //evento de desconexion de sockets para cuando se desconecte un socket
        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            //quitando el usuario que se desconecto usando filter
            nicknames = nicknames.filter(user => user != socket.nickname);
            //actualizando el arreglo
            actualizaUsuarios();
        });

        socket.on('disconnect me', data =>{
            //quitando el usuario que se desconecto usando filter
            nicknames = nicknames.filter(user => user != socket.nickname);
            //actualizando el arreglo
            actualizaUsuarios();
        });

        function actualizaUsuarios(){
            io.sockets.emit('usernames', nicknames);
        }

    });
}