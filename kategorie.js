var kategorieID = [];

function tabelaKategorie() {
  var tabelaKategorie = document.getElementById("tabela-kategorie");

  fetch("http://127.0.0.231:2010/kategorie")
    .then(resp => resp.json())
    .then(resp => {
      for(var i = 0; i < resp.length; i++) {
        kategorieID[i] = resp[i].id_kategoria;
        const wiersz = document.createElement("tr");
        wiersz.innerHTML = "<td>" + resp[i].nazwa + "</td>";
        tabelaKategorie.appendChild(wiersz);
      }
    })

}

function dodajKategorie() {
  var form = document.getElementById("kategorie-form");
	const dane = {
	  nazwa: document.getElementsByName("nazwa")[0].value,
    id_kategoria: Math.max(...kategorieID) + 1
	};

  if(dane.nazwa !== "") {

    fetch("http://127.0.0.231:2010/dodajKategorie", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano kategorię ");
          console.log(res);
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

window.onload = tabelaKategorie;
