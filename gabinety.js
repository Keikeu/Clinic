var gabinetyID = [];

function tabelaGabinety() {
  var tabelaGabinety = document.getElementById("tabela-gabinety");

  fetch("http://127.0.0.231:2010/gabinety")
    .then(resp => resp.json())
    .then(resp => {
        for(var i = 0; i < resp.length; i++) {
          gabinetyID[i] = resp[i].id_gabinet;
          const wiersz = document.createElement("tr");
          wiersz.innerHTML = "<td>" + resp[i].nazwa + "</td>";
          tabelaGabinety.appendChild(wiersz);
        }
    })
}

function dodajGabinet() {
  var form = document.getElementById("gabinety-form");
	const dane = {
	  nazwa: document.getElementsByName("nazwa")[0].value,
    id_gabinet: Math.max(...gabinetyID) + 1
	};

  if(dane.nazwa !== "") {
    fetch("http://127.0.0.231:2010/dodajGabinet", {
          method: "PUT",
	        body: JSON.stringify(dane),
	        headers: {
	            'Content-type': 'application/json',
	            'Access-Control-Allow-Origin': '*'
	        }
      })
      .then(res => res.json())
      .then(res => {
          console.log("Dodano gabinet ");
          console.log(res);
          location.reload();
      })
      .catch(error => console.log("Blad: ", error));
  }
}

window.onload = tabelaGabinety;
