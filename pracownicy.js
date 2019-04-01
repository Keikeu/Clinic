var pracownicyID = [];

function tabelaPracownicy() {
  var tabelaPracownicy = document.getElementById("tabela-pracownicy");

  fetch("http://127.0.0.231:2010/pracownicy")
    .then(resp => resp.json())
    .then(resp => {
        for(var i = 0; i < resp.length; i++) {
          pracownicyID[i] = resp[i].id_pracownik;
          const wiersz = document.createElement("tr");
          wiersz.innerHTML = "<td>" + resp[i].imie + "</td><td>" + resp[i].nazwisko + "</td><td>" + resp[i].rola + "</td>";
          tabelaPracownicy.appendChild(wiersz);
        }
    })
}

function dodajPracownika() {
  var form = document.getElementById("pracownicy-form");
	const dane = {
	  imie: document.getElementsByName("imie")[0].value,
	  nazwisko: document.getElementsByName("nazwisko")[0].value,
	  rola: document.getElementsByName("rola")[0].value,
    id_pracownik: Math.max(...pracownicyID) + 1
	};

  console.log(dane);

  if(dane.imie !== "" && dane.nazwisko !== "" && dane.rola !== "Wybierz . . .") {
    fetch("http://127.0.0.231:2010/dodajPracownika", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano pracownika ");
          console.log(res);
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

window.onload = tabelaPracownicy;
