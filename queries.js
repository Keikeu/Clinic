var Client = require('pg');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'u6placek',
  host: 'pascal.fis.agh.edu.pl',
  database: 'u6placek',
  password: '6placek',
  port: 5432,
})

pool.connect();

const getWizyty = (request, response) => {
  pool.query('SELECT id_wizyta, data, godzina_start, godzina_stop, usluga.nazwa, pacjent.imie, pacjent.nazwisko, pracownik.imie AS pimie, pracownik.nazwisko AS pnazwisko, gabinet.nazwa as gnazwa, usluga.koszt FROM wizyta INNER JOIN usluga ON wizyta.id_usluga = usluga.id_usluga INNER JOIN pacjent ON pacjent.id_pacjent = wizyta.id_pacjent INNER JOIN pracownik ON pracownik.id_pracownik = wizyta.id_pracownik INNER JOIN gabinet ON gabinet.id_gabinet = wizyta.id_gabinet', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getWizytyDzisiaj = (request, response) => {
  const dzisiaj = request.query.dzisiaj;
  pool.query(`SELECT data, godzina_start, godzina_stop, usluga.nazwa, pacjent.imie, pacjent.nazwisko, pracownik.imie AS pimie, pracownik.nazwisko AS pnazwisko, gabinet.nazwa AS gnazwa, usluga.koszt FROM wizyta INNER JOIN pacjent ON pacjent.id_pacjent = wizyta.id_pacjent INNER JOIN pracownik ON pracownik.id_pracownik = wizyta.id_pracownik INNER JOIN usluga ON usluga.id_usluga = wizyta.id_usluga INNER JOIN gabinet ON gabinet.id_gabinet = wizyta.id_gabinet WHERE data = $1`, [dzisiaj], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const wizytyMiesiac = (request, response) => {
  pool.query('SELECT COUNT(id_wizyta) FROM wizyta WHERE data BETWEEN $1 AND $2', ['2019-02-01', '2019-02-28'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPracownicy = (request, response) => {
  pool.query('SELECT * FROM pracownik', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPacjenci = (request, response) => {
  pool.query('SELECT * FROM pacjent', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getGabinety = (request, response) => {
  pool.query('SELECT * FROM gabinet', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUslugi = (request, response) => {
  pool.query('SELECT usluga.id_usluga, usluga.nazwa, koszt, kategoria.nazwa AS knazwa FROM usluga INNER JOIN kategoria ON kategoria.id_kategoria = usluga.id_kategoria', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getKategorie = (request, response) => {
  pool.query('SELECT * FROM kategoria', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getZeby = (request, response) => {
  pool.query('SELECT * FROM zab', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const kosztMiesiac = (request, response) => {
  pool.query('SELECT SUM(koszt) FROM usluga INNER JOIN wizyta ON usluga.id_usluga = wizyta.id_usluga WHERE wizyta.data BETWEEN $1 AND $2', ['2019-02-01', '2019-02-17'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const pracownikMiesiac = (request, response) => {
  pool.query('SELECT pracownik.imie, pracownik.nazwisko FROM wizyta INNER JOIN pracownik ON wizyta.id_pracownik = pracownik.id_pracownik GROUP BY pracownik.imie, pracownik.nazwisko ORDER BY COUNT(id_wizyta) DESC LIMIT 1', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const pacjentZeby = (request, response) => {
  const id = request.query.id;

  pool.query('SELECT zab.stan, zab.numer FROM zab WHERE id_pacjent = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const pacjentZab = (request, response) => {
  const id = request.query.id;
  const nr = request.query.nr;

  pool.query('SELECT * FROM zab WHERE numer = $1 AND id_pacjent = $2', [nr, id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const pacjentWizyty = (request, response) => {
  const id = request.query.id;

  pool.query('SELECT data, godzina_start, godzina_stop, usluga.nazwa, pracownik.imie, pracownik.nazwisko, gabinet.nazwa as gnazwa FROM wizyta INNER JOIN usluga ON wizyta.id_usluga = usluga.id_usluga INNER JOIN pracownik ON pracownik.id_pracownik = wizyta.id_pracownik INNER JOIN gabinet ON gabinet.id_gabinet = wizyta.id_gabinet WHERE wizyta.id_pacjent = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const dodajGabinet = (request, response) => {
  const id_gabinet = request.body.id_gabinet;
  const nazwa = request.body.nazwa;

  pool.query('INSERT INTO gabinet ( id_gabinet, nazwa ) VALUES ( $1, $2)', [id_gabinet, nazwa], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajZab = (request, response) => {
  const id_zab = request.body.id_zab;
  const id_pacjent = request.body.id_pacjent;
  const numer = request.body.numer;
  const stan = request.body.stan;

  pool.query('INSERT INTO zab ( id_zab, id_pacjent, numer, stan ) VALUES ( $1, $2, $3, $4)', [id_zab, id_pacjent, numer, stan], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajUsluge = (request, response) => {
  const id_usluga = request.body.id_usluga;
  const id_kategoria = request.body.id_kategoria;
  const nazwa = request.body.nazwa;
  const koszt = request.body.koszt;

  pool.query('INSERT INTO usluga ( id_usluga, id_kategoria, nazwa, koszt ) VALUES ( $1, $2, $3, $4)', [id_usluga, id_kategoria, nazwa, koszt], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajWizyte = (request, response) => {
  const id_wizyta = request.body.id_wizyta; //?
  const id_pacjent = request.body.id_pacjent;
  const id_pracownik = request.body.id_pracownik;
  const id_gabinet = request.body.id_gabinet;
  const id_usluga = request.body.id_usluga;
  const data = request.body.data;
  const godzina_start = request.body.godzina_start;
  const godzina_stop = request.body.godzina_stop;

  pool.query('INSERT INTO wizyta ( id_wizyta, id_pacjent, id_pracownik, id_gabinet, id_usluga, data, godzina_start, godzina_stop ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)', [id_wizyta, id_pacjent, id_pracownik, id_gabinet, id_usluga, data, godzina_start, godzina_stop], (error, results) => {
    if (error) {
      throw error//
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajPacjenta = (request, response) => {
  const id_pacjent = request.body.id_pacjent;
  const imie = request.body.imie;
  const nazwisko = request.body.nazwisko;
  const telefon = request.body.telefon;

  pool.query('INSERT INTO pacjent ( id_pacjent, imie, nazwisko, telefon ) VALUES ( $1, $2, $3, $4)', [id_pacjent, imie, nazwisko, telefon], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajPracownika = (request, response) => {
  const id_pracownik = request.body.id_pracownik;
  const imie = request.body.imie;
  const nazwisko = request.body.nazwisko;
  const rola = request.body.rola;

  pool.query('INSERT INTO pracownik ( id_pracownik, imie, nazwisko, rola ) VALUES ( $1, $2, $3, $4)', [id_pracownik, imie, nazwisko, rola], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const dodajKategorie = (request, response) => {
  const id_kategoria = request.body.id_kategoria;
  const nazwa = request.body.nazwa;

  pool.query('INSERT INTO kategoria ( id_kategoria, nazwa ) VALUES ( $1, $2 )', [id_kategoria, nazwa], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })
}

const zmodyfikujZab = (request, response) => {
  const stan = request.body.stan;
  const id_pacjent = request.body.id_pacjent;
  const numer = request.body.numer;

  pool.query('UPDATE zab SET stan = $1 WHERE id_pacjent = $2 AND numer = $3', [stan, id_pacjent, numer], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'OK'})
  })

}

module.exports = {
  getWizyty, getWizytyDzisiaj, wizytyMiesiac,
  getPracownicy,
  getPacjenci, pacjentZeby,
  getGabinety,
  getUslugi,
  getKategorie,
  getZeby,
  kosztMiesiac, pracownikMiesiac,
  pacjentZab, pacjentWizyty,
  dodajGabinet, dodajZab, dodajUsluge, dodajWizyte, dodajPacjenta, dodajPracownika, dodajKategorie,
  zmodyfikujZab
}
