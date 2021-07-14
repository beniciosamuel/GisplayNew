$(document).ready(() => {
    $(document).on('submit', () => {
        return false;
    })
})

$('#formRegister').submit(() => {    
    const dataUser = {
        username: $('#userField').val(),
        email: $('#emailField').val(),
        password: $('#passField').val(),
        repassword: $('#repassField').val(),
        groupcode: $('#groupcode').val(),
        groupsl: $('#groupsl').val()
    }    
    
    if (dataUser.password != dataUser.repassword) {
        console.log('Teste')
        $('#myAlert').html('Sua senha não confere!');
        $("#myAlert").addClass("in")
        setTimeout(() => {
            $("#myAlert").removeClass("in") 
            $("#myAlert").addClass("out") 
        }, 4000);
    } else {
        dbOpera.readData('Multiplay-70DE/users/').then((usersList) => {            
            Object.keys(usersList).forEach((user) => {                
                if (dataUser.username == user) {
                    $('#myAlert').html('O nome de usuário já consta!');
                    $("#myAlert").addClass("in")
                    setTimeout(() => {
                        $("#myAlert").removeClass("in") 
                        $("#myAlert").addClass("out") 
                    }, 4000);
                } else {
                    dbOpera.newUser(dataUser).then((userData) => {
                        $('#myAlert').html('O Usuário foi criado com Sucesso! Por favor verifique seu Email.');
                        $("#myAlert").addClass("in");
                        setTimeout(() => {
                            $("#myAlert").removeClass("in");
                            $("#myAlert").addClass("out");
                            window.location.assign("/");
                        }, 4000);
                    }).catch((err) => {
                        $('#myAlert').html(err.message);
                        $("#myAlert").addClass("in");
                        setTimeout(() => {
                            $("#myAlert").removeClass("in"); 
                            $("#myAlert").addClass("out") ;
                        }, 4000);
                    })
                };
            });
        });
    }
})

