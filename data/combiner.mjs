import * as d3 from 'd3';
import * as fs from 'fs';

const municipalities = JSON.parse(
  fs.readFileSync('./data/municipalities.json', 'utf-8'),
);
const metrics = JSON.parse(
  fs.readFileSync('./data/municipality_metrics.json', 'utf-8'),
);

municipalities.features.forEach((f) => {
  f.properties = {
    ...f.properties,
    ...metrics.find((m) => m.id === f.id),
  };
});

fs.writeFileSync(
  'combined.json',
  JSON.stringify(municipalities, null, 2),
  'utf-8',
);
