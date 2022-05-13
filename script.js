var ficha;
var intervalIdCrear;
var intervalIdConectar;

$("#crearPartida").click(function() {

    ficha = "X";

    //Creem la partida
    if($("#nomPartida").val()!="" && $("#passPartida").val()!="") {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                //S'amaga el formulari i es mostra el taulell
                $("#formStart").hide();
                $("#tablero").css("display", "block");
                $(".cela").css('background-image','none');

                intervalIdCrear = setInterval(infoGame,250);

            }

        };

        xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send('{"action": "createGame","gameName": "'+$("#nomPartida").val()+'","gamePassword": "'+$("#passPartida").val()+'"}');

    }else if($("#nomPartida").val() == ""){
        alert("Has d'introduir el nom de la partida");
    }else if($("#passPartida").val() == ""){
        alert("Has d'introduir la contrasenya de la partida");
    }

});

$("#conectarPartida").click(function () {

    ficha = "O";

    //Ens conectem a la partida
    if($("#nomPartida").val()!="") {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                var response = JSON.parse(this.responseText);

                if(response.status == "OK" && response.player == "") {
                    //S'amaga el formulari i es mostra el taulell
                    $("#formStart").hide();
                    $("#tablero").css("display", "block");
                    $(".cela").css('background-image','none');
                    intervalIdConectar = setInterval(infoGame,250);
                }else if(response.status == "KO"){
                    alert("La partida no existeix");
                }else if(response.player != ""){
                    alert("La partida ja esta començada, espera a que es torni a crear");
                }
            }

        };

        xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send('{"action": "infoGame","gameName": "'+$("#nomPartida").val()+'"}');
    }else{
        alert("Has d'introduir el nom de la partida");
    }

});

$(".cela").click(function () {

    var idCela = this.id;

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            //Comprovem que la cela que hem clicat sigui buida
            if($("#"+idCela).css("background-image") == "none") {

                jugar(idCela, ficha);

            }else{
                alert("No pots posar fitxa aqui");
            }

        }

    };

    xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"action": "infoGame","gameName": "'+$("#nomPartida").val()+'"}');


});

function jugar(idCela, jugador){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            var response = JSON.parse(this.responseText);

            if (response.status == "OK") {

                $("#" + idCela).css("background-image", "url(imatges/" + jugador + ".png)");

            }else{
                alert("No es el teu torn");
            }
        }

    };

    xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"action": "playGame","gameName": "'+$("#nomPartida").val()+'","movement": "'+idCela+'","player": "'+jugador+'"}');

}

function infoGame(){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            //Pasem la resposta a JSON
            var response = JSON.parse(this.responseText);

            printarTaulell(response.gameInfo);

            comprovarVictoria();

        }

    };

    xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"action": "infoGame","gameName": "'+$("#nomPartida").val()+'"}');

}

function printarTaulell(gameInfo){

    for(var cela in gameInfo){
        if(gameInfo[cela] == "X"){
            $("#" + cela).css("background-image", "url(imatges/X.png)");
        }else if(gameInfo[cela] == "O"){
            $("#" + cela).css("background-image", "url(imatges/O.png)");
        }
    }

}

function comprovarVictoria(){

    var X = 'url("imatges/X.png")';
    var O = 'url("imatges/O.png")';

    var A1 = document.getElementById('A1').style.backgroundImage;
    var A2 = document.getElementById('A2').style.backgroundImage;
    var A3 = document.getElementById('A3').style.backgroundImage;
    var B1 = document.getElementById('B1').style.backgroundImage;
    var B2 = document.getElementById('B2').style.backgroundImage;
    var B3 = document.getElementById('B3').style.backgroundImage;
    var C1 = document.getElementById('C1').style.backgroundImage;
    var C2 = document.getElementById('C2').style.backgroundImage;
    var C3 = document.getElementById('C3').style.backgroundImage;

    if( A1 == X && A2 == X && A3 == X ||
        B1 == X && B2 == X && B3 == X ||
        C1 == X && C2 == X && C3 == X ||
        A1 == X && B2 == X && C3 == X ||
        C1 == X && B2 == X && A3 == X ||
        A1 == X && B1 == X && C1 == X ||
        A2 == X && B2 == X && C2 == X ||
        A3 == X && B3 == X && C3 == X ){

        alert("X Guanyen");

        $("#formStart").show();
        $("#tablero").css("display", "none");
        clearInterval(intervalIdCrear);
        clearInterval(intervalIdConectar);
        borrarPartida();

    }else if(   A1 == O && A2 == O && A3 == O ||
                B1 == O && B2 == O && B3 == O ||
                C1 == O && C2 == O && C3 == O ||
                A1 == O && B2 == O && C3 == O ||
                C1 == O && B2 == O && A3 == O ||
                A1 == O && B1 == O && C1 == O ||
                A2 == O && B2 == O && C2 == O ||
                A3 == O && B3 == O && C3 == O ){

        alert("O Guanyen");

        $("#formStart").show();
        $("#tablero").css("display", "none");
        clearInterval(intervalIdCrear);
        clearInterval(intervalIdConectar);
        borrarPartida();

    }else if(   A1 != "none" && A2 != "none" && A3 != "none" && B1 != "none" && B2 != "none" && B3 != "none"
                && C1 != "none" && C2 != "none" && C3 != "none"){

        alert("Empat");

        $("#formStart").show();
        $("#tablero").css("display", "none");
        clearInterval(intervalIdCrear);
        clearInterval(intervalIdConectar);
        borrarPartida();

    }
}

function borrarPartida() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {};

    xhttp.open("POST", "https://tictactoe.codifi.cat/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"action": "createGame","gameName": "'+$("#nomPartida").val()+'","gamePassword": "'+$("#passPartida").val()+'"}');
}