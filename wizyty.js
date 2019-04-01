var wizytyID = [];

function tabelaWizyty() {
  var tabelaWizyty = document.getElementById("tabela-wizyty");
  var options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

  fetch("http://127.0.0.231:2010/wizyty")
    .then(resp => resp.json())
    .then(resp => {
      for(var i = 0; i < resp.length; i++) {
        wizytyID[i] = resp[i].id_wizyta;
        const wiersz = document.createElement("tr");
        wiersz.innerHTML = "<td>" + new Date(resp[i].data).toLocaleDateString("pl-PL", options) + "</td><td>" + resp[i].godzina_start.substring(0,5) + "-" + resp[i].godzina_stop.substring(0,5) + "</td><td>" + resp[i].nazwa + "</td><td>" + resp[i].imie + " " + resp[i].nazwisko + "</td><td>" + resp[i].pimie + " " + resp[i].pnazwisko + "</td><td>" + resp[i].gnazwa + "</td>";
        tabelaWizyty.appendChild(wiersz);
      }
    })
    .catch(error => console.log("Blad: ", error));

    wybor();
}

function dodajWizyte() {
  var form = document.getElementById("wizyty-form");
	const dane = {
	  id_pacjent: document.getElementsByName("pacjent")[0].value,
	  id_pracownik: document.getElementsByName("pracownik")[0].value,
	  id_usluga: document.getElementsByName("usluga")[0].value,
	  id_gabinet: document.getElementsByName("gabinet")[0].value,
	  data: document.getElementsByName("data")[0].value,
	  godzina_start: document.getElementsByName("godzina_start")[0].value,
	  godzina_stop: document.getElementsByName("godzina_stop")[0].value,
    id_wizyta: Math.max(...wizytyID) + 1
	};

  var dzisiaj = new Date();

  if(dane.godzina_start !== "" && dane.godzina_stop !== "" && dane.godzina_start > dane.godzina_stop) { alert("Niepoprawne godziny wizyty"); }
  if(dane.id_pacjent !== "Wybierz . . ." && dane.id_pracownik !== "Wybierz . . ." && dane.id_usluga !== "Wybierz . . ." && dane.id_gabinet !== "Wybierz . . ." && dane.godzina_start !== "" && dane.godzina_stop !== "" && dane.godzina_start < dane.godzina_stop) {
    fetch("http://127.0.0.231:2010/dodajWizyte", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano wizytę ");
          console.log(res);
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

function wybor() {

  var selectPacjent = document.getElementById("select-pacjent");
  var selectPracownik = document.getElementById("select-pracownik");
  var selectGabinet = document.getElementById("select-gabinet");
  var selectUsluga = document.getElementById("select-usluga");

  fetch("http://127.0.0.231:2010/pacjenci")
  .then(resp => resp.json())
  .then(resp => {
    for(var i = 0; i < resp.length; i++) {
      const opcja = document.createElement("option");
      opcja.setAttribute('value', resp[i].id_pacjent); opcja.text = resp[i].imie + " " + resp[i].nazwisko;
      selectPacjent.appendChild(opcja);
    }
  })

  fetch("http://127.0.0.231:2010/pracownicy")
  .then(resp => resp.json())
  .then(resp => {
    for(var i = 0; i < resp.length; i++) {
      const opcja = document.createElement("option");
      opcja.setAttribute('value', resp[i].id_pracownik); opcja.text = resp[i].imie + " " + resp[i].nazwisko;
      selectPracownik.appendChild(opcja);
    }
  })

  fetch("http://127.0.0.231:2010/gabinety")
  .then(resp => resp.json())
  .then(resp => {
    for(var i = 0; i < resp.length; i++) {
      const opcja = document.createElement("option");
      opcja.setAttribute('value', resp[i].id_gabinet); opcja.text = resp[i].nazwa;
      selectGabinet.appendChild(opcja);
    }
  })

  fetch("http://127.0.0.231:2010/uslugi")
  .then(resp => resp.json())
  .then(resp => {
    for(var i = 0; i < resp.length; i++) {
      const opcja = document.createElement("option");
      opcja.setAttribute('value', resp[i].id_usluga); opcja.text = resp[i].nazwa;
      selectUsluga.appendChild(opcja);
    }
  })
}

window.onload = tabelaWizyty;
