var uslugiID = [];

function tabelaUslugi() {
  var tabelaUslugi = document.getElementById("tabela-uslugi");

    fetch("http://127.0.0.231:2010/uslugi")
    .then(resp => resp.json())
    .then(resp => {
      for(var i = 0; i < resp.length; i++) {
        uslugiID[i] = resp[i].id_usluga;
        const wiersz = document.createElement("tr");
        wiersz.innerHTML = "<td>" + resp[i].nazwa + "</td><td>" + resp[i].knazwa + "</td><td>" + resp[i].koszt + "</td>";
        tabelaUslugi.appendChild(wiersz);
      }
    })
    wybor();
}

function dodajUsluge() {
  var form = document.getElementById("uslugi-form");
	const dane = {
	  nazwa: document.getElementsByName("nazwa")[0].value,
	  id_kategoria: document.getElementsByName("kategoria")[0].value,
	  koszt: document.getElementsByName("koszt")[0].value,
    id_usluga: Math.max(...uslugiID) + 1
	};

  if(dane.nazwa !== "" && dane.koszt !== "" && dane.id_kategoria !== "Wybierz . . .") {
    fetch("http://127.0.0.231:2010/dodajUsluge", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano usługę ");
          console.log(res);
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

function wybor() {
  var selectKategoria = document.getElementById("select-kategoria");

  fetch("http://127.0.0.231:2010/kategorie")
  .then(resp => resp.json())
  .then(resp => {
    for(var i = 0; i < resp.length; i++) {
      const opcja = document.createElement("option");
      opcja.setAttribute('value', resp[i].id_kategoria); opcja.text = resp[i].nazwa;
      selectKategoria.appendChild(opcja);
    }
  })
}

window.onload = tabelaUslugi;
