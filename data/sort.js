const fs = require('fs');
const bla = require('./combined.json');
const turf = require('@turf/turf');

bla.features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

fs.writeFileSync(
  'sorted.json',
  JSON.stringify(turf.featureCollection(bla.features), null, 2),
  'utf-8',
);
