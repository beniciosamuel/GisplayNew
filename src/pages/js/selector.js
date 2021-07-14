$(document).ready(() => {
    
})

$('#updateone').click(() => {
    $("#loadScreen").addClass("in");
    dbOpera.download()
    .then((app) => {
        const link = window.document.createElement('a');
        link.href = window.URL.createObjectURL(app);
        link.download = 'gisplay-leaflet.apk';
        link.click();
        $("#loadScreen").removeClass("in");
        $("#loadScreen").removeClass("out");
        $('#myAlert').html("Download concluído! Transferindo.");
        $("#myAlert").addClass("in")
        setTimeout(() => {
            $("#myAlert").removeClass("in") 
            $("#myAlert").addClass("out") 
        }, 4000);
    }).catch((err) => {
        $("#loadScreen").removeClass("in");
        $("#loadScreen").removeClass("out");
        $('#myAlert').html("Houve um erro com o Download!");
        $("#myAlert").addClass("in")
        setTimeout(() => {
            $("#myAlert").removeClass("in") 
            $("#myAlert").addClass("out") 
        }, 4000);
    })
})

