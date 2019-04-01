var pacjenciID = [];
var zebyID = [];

function tabelaPacjenci() {
  var tabelaPacjenci = document.getElementById("tabela-pacjenci");

  fetch("http://127.0.0.231:2010/pacjenci")
    .then(resp => resp.json())
    .then(resp => {
        for(var i = 0; i < resp.length; i++) {
          pacjenciID[i] = resp[i].id_pacjent;
          const wiersz = document.createElement("tr");
          wiersz.innerHTML = "<td>" + resp[i].imie + "</td><td>" + resp[i].nazwisko + "</td><td>" + resp[i].telefon + "</td><td><i class=\"fas fa-eye\" onclick=\"onSzczegoly(" + resp[i].id_pacjent + ")\"></i></td>";
          tabelaPacjenci.appendChild(wiersz);
        }

        fetch("http://127.0.0.231:2010/zeby")
        .then(resp => resp.json())
        .then(resp => {
          for(var i = 0; i < resp.length; i++) {
            zebyID[i] = resp[i].id_zab;
          }
        })
        .catch(error => console.log("Blad: ", error));
    })

}
window.onload = tabelaPacjenci;


function dodajPacjenta() {
  var form = document.getElementById("pacjenci-form");
	const dane = {
	  imie: document.getElementsByName("imie")[0].value,
	  nazwisko: document.getElementsByName("nazwisko")[0].value,
	  telefon: document.getElementsByName("telefon")[0].value,
    id_pacjent: Math.max(...pacjenciID) + 1
	};

  console.log(dane);

  if(dane.imie !== "" && dane.nazwisko !== "" && dane.telefon.length === 15) {
    fetch("http://127.0.0.231:2010/dodajPacjenta", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano pacjenta ");
          console.log(res);
          var k = 1;

          for(var i = 1; i < 5; i++) {
            for(var j = 1; j < 9; j++) {
              var daneZab = {
                id_pacjent: dane.id_pacjent,
                id_zab: Math.max(...zebyID) + k,
                numer: i*10 + j,
                stan: "zdrowy"
              };
              console.log(daneZab.id_zab);
              k += 1;

              fetch("http://127.0.0.231:2010/dodajZab", {
                method: "PUT",
                body: JSON.stringify(daneZab),
                headers: {
                  'Content-type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                }
              })
              .then(res => res.json())
              .then(res => {})

            }
          }
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

function onSzczegoly(id) {
  document.getElementById(activeTable + "-overlay-details").style.display = "block";
  var klocki = document.getElementsByClassName("tooth");

  fetch("http://127.0.0.231:2010/pacjentZeby?id="+id)
    .then(resp => resp.json())
    .then(resp => {
        for(var i = 0; i < resp.length; i++) {
          if(resp[i].stan == "do wyprostowania"){
            document.getElementById("tooth-" + resp[i].numer).classList = "tooth sick1";
          }
          else if(resp[i].stan == "do wyleczenia"){
            document.getElementById("tooth-" + resp[i].numer).classList = "tooth sick2";
          }
          else if(resp[i].stan == "do usunięcia"){
            document.getElementById("tooth-" + resp[i].numer).classList = "tooth sick3";
          }
          else document.getElementById("tooth-" + resp[i].numer).classList = "tooth";
        }
    })

  for(var i = 0; i < klocki.length; i++) {
    (function() {
      var nr = document.getElementsByClassName("tooth")[i].id.substring(6,8);
      klocki[i].addEventListener("click", function() { onSzczegolyZeba(id, nr); });
    }());
  }

  pacjentWizyty(id);
}

function pacjentWizyty(id) {
  var pacjentWizyty = document.getElementById("pacjentWizyty");
  var options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
  pacjentWizyty.innerHTML = "";

  fetch("http://127.0.0.231:2010/pacjentWizyty?id="+id)
    .then(resp => resp.json())
    .then(resp => {
        if(resp.length !== 0) {
          for(var i = 0; i < resp.length; i++) {
            const wiersz = document.createElement("tr");
            wiersz.innerHTML = "<td>" + new Date(resp[i].data).toLocaleDateString("pl-PL", options) + "</td><td>" + resp[i].godzina_start.substring(0,5) + "-" + resp[i].godzina_stop.substring(0,5) + "</td><td>" + resp[i].nazwa + "</td><td>" + resp[i].imie + " " + resp[i].nazwisko + "</td><td>" + resp[i].gnazwa + "</td>";
            pacjentWizyty.appendChild(wiersz);
          }
        }
        else pacjentWizyty.innerHTML = "";
    })
}

function onSzczegolyZeba(id, nr) {
  identyfikator = id;
  document.getElementsByClassName("tooth-details")[0].style.display = "block";
  document.getElementById("numer-zeba").innerHTML = nr;
  var pacjentZab = document.getElementById("pacjentZab");

  fetch("http://127.0.0.231:2010/pacjentZab?nr="+nr+"&id="+id)
    .then(resp => resp.json())
    .then(resp => {
      if(resp[0].stan === "zdrowy") { pacjentZab.stan[0].checked = true; }
      else if(resp[0].stan === "do wyprostowania") { pacjentZab.stan[1].checked = true; }
      else if(resp[0].stan === "do wyleczenia") { pacjentZab.stan[2].checked = true; }
      else if(resp[0].stan === "do usunięcia") { pacjentZab.stan[3].checked = true; }
    })
}

function zmodyfikujZab() {
  var pacjentZab = document.getElementById("pacjentZab");
  var tempStan;
  if(pacjentZab.stan[0].checked) tempStan = pacjentZab.stan[0].value;
  else if(pacjentZab.stan[1].checked) tempStan = pacjentZab.stan[1].value;
  else if(pacjentZab.stan[2].checked) tempStan = pacjentZab.stan[2].value;
  else if(pacjentZab.stan[3].checked) tempStan = pacjentZab.stan[3].value;

	const daneModyfikacja = {
	  stan: tempStan,
	  id_pacjent: identyfikator,
    numer: document.getElementById("numer-zeba").innerHTML
	};

  fetch("http://127.0.0.231:2010/zmodyfikujZab", {
    method: "POST",
    body: JSON.stringify(daneModyfikacja),
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  .then(res => res.json())
  .then(res => { console.log(daneModyfikacja); })
  .catch(error => console.log("Blad: ", error));
}

function onCloseForm() {
  document.getElementById(activeTable + "-overlay").style.display = "none";
  document.getElementById(activeTable + "-overlay-details").style.display = "none";
}

var identyfikator;
