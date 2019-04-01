function tabelaWizytyDzisiaj() {
  var tabelaWizytyDzisiaj = document.getElementById("tabela-wizyty-dzisiaj");
  var miesiace = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var dzisiaj = new Date();
  var dzisiaj = dzisiaj.getFullYear() + "-" + miesiace[dzisiaj.getMonth()] + "-" + dzisiaj.getDate();
  console.log(dzisiaj);

  fetch("http://127.0.0.231:2010/wizytyDzisiaj?dzisiaj="+dzisiaj)
    .then(resp => resp.json())
    .then(resp => {
        for(var i = 0; i < resp.length; i++) {
          const wiersz = document.createElement("tr");
          wiersz.innerHTML = "<td>" + resp[i].godzina_start.substring(0,5) + " - " + resp[i].godzina_stop.substring(0,5) + "</td><td>" + resp[i].nazwa + "</td><td>" + resp[i].imie + " " + resp[i].nazwisko + "</td><td>" + resp[i].pimie + " " + resp[i].pnazwisko + "</td><td>" + resp[i].gnazwa + "</td><td>" + resp[i].koszt + "</td>";
          tabelaWizytyDzisiaj.appendChild(wiersz);
        }
    })
    .catch(error => console.log("Blad: ", error));

    statystykiMiesiaca();
}

function statystykiMiesiaca() {
  var wizytyMiesiac = document.getElementById("wizytyMiesiac");
  var kosztMiesiac = document.getElementById("kosztMiesiac");
  var pracownikMiesiac = document.getElementById("pracownikMiesiac");

    fetch("http://127.0.0.231:2010/wizytyMiesiac")
      .then(resp => resp.json())
      .then(resp => {
          wizytyMiesiac.innerHTML = resp[0].count;
      })

    fetch("http://127.0.0.231:2010/kosztMiesiac")
      .then(resp => resp.json())
      .then(resp => {
          kosztMiesiac.innerHTML = resp[0].sum;
      })

    fetch("http://127.0.0.231:2010/pracownikMiesiac")
      .then(resp => resp.json())
      .then(resp => {
          pracownikMiesiac.innerHTML = resp[0].imie + " " + resp[0].nazwisko;
      })
}

window.onload = tabelaWizytyDzisiaj;
