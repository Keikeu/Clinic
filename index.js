const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 2010
const db = require('./queries')
var cors = require('cors')
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Projekt na bazy danych - Karolina Placek' })
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.get('/wizyty', db.getWizyty)
app.get('/wizytyDzisiaj', db.getWizytyDzisiaj)
app.get('/pracownicy', db.getPracownicy)
app.get('/pacjenci', db.getPacjenci)
app.get('/pacjentZeby', db.pacjentZeby)
app.get('/gabinety', db.getGabinety)
app.get('/uslugi', db.getUslugi)
app.get('/kategorie', db.getKategorie)
app.get('/zeby', db.getZeby)

app.get('/wizytyMiesiac', db.wizytyMiesiac)
app.get('/kosztMiesiac', db.kosztMiesiac)
app.get('/pracownikMiesiac', db.pracownikMiesiac)

app.get('/pacjentZab', db.pacjentZab)
app.get('/pacjentWizyty', db.pacjentWizyty)

app.put('/dodajGabinet', db.dodajGabinet)
app.put('/dodajUsluge', db.dodajUsluge)
app.put('/dodajPacjenta', db.dodajPacjenta)
app.put('/dodajPracownika', db.dodajPracownika)
app.put('/dodajWizyte', db.dodajWizyte)
app.put('/dodajZab', db.dodajZab)
app.put('/dodajKategorie', db.dodajKategorie)

app.post('/zmodyfikujZab', db.zmodyfikujZab)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
