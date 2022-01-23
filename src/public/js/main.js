$(function() {
    const socket = io();

    //obteniendo elementos desde interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obteniendo elementos desde el formulario userName
    const $userForm = $('#userForm');
    const $userName = $('#userName');
    const $userError = $('#userError');

    //obteniendo elementos del formulario users
    const $users = $('#usernames');

    //obteniendo formulario de salida
    const $exitForm = $('#exit-user-form');

    $userForm.submit(e => {
        //evitar que se refresque la pagina
        e.preventDefault();
        //validando el nombre con socket con el evento new user
        socket.emit('new user', $userName.val(), (data) => {
            if($userName.val() === ''){
                $userError.html(`
                        <div class="alert alert-danger">
                            El usuario no puede estar vacío.
                        </div>
                    `);
            }else{
                if (data) {
                    $('#userWrap').hide();
                    $('#contentWrap').show();
                    $('#chat-tittle').append($userName.val());                                       
                } else {
                    $userError.html(`
                        <div class="alert alert-danger">
                            El usuario ya existe.
                        </div>
                    `);
                }
                $userName.val('');
            }
            
        });
    });

    //evento para enviar el formulario
    $messageForm.submit(e => {
        //para evitar que refresque la pagina
        e.preventDefault();
        socket.emit('send message', $messageBox.val());
        $messageBox.val('');
    });

    //evento para hacer la desconexion del usuario
    $exitForm.submit(e => {
        e.preventDefault();
        socket.emit('disconnect me', $userName.val());
        $('#contentWrap').hide();
        $('#userWrap').show();
    });

    //evento para cachar el mensaje
    socket.on('new message', data => {
        $chat.append('<b>' + data.nick + '</b> </br>' + `<div class="card"><div class="card-header">` +data.msg + '</div></div> <br/>');
        
    });

    //para recibir los usuarios que hay 
    socket.on('usernames', data =>{
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fa fa-user"></i>${data[i]}</p>`            
        }
        $users.html(html);
    });

})