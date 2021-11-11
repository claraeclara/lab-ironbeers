const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const { getEnabledCategories } = require('trace_events');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers() //returns a promise
    .then(beersFromApi => {
      console.log('Beers from the database: ', beersFromApi);
      const data = { beersList: beersFromApi };
      res.render('beers', data);
    });
});

app.get('/random-beers', (req, res) => {
  punkAPI
    .getRandom() //returns a promise
    .then(responseFromApi => {
      const randomBeer = responseFromApi[0];
      res.render('random-beer', { oneBeer: randomBeer });
    });
});

//GET /beers/beer-789xcf
app.get('/beers/beer-:beerId', (req, res) => {
  const beerId = req.params.beerId;

  punkAPI.getBeer(beerId).then(oneBeerArr => {
    const oneBeer = oneBeerArr[0];
    res.render('random-beer', { oneBeer: oneBeer });
  });
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
