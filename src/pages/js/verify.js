$('#return').click(() => {
    window.location.assign('/')
})

$('#resend').click(() => {
    dbOpera.resend().then((status) => {
        console.log('Verificação enviada!')
        window.location.assign('/');
    })
})