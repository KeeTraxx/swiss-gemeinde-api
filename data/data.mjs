import * as d3 from 'd3';
import * as fs from 'fs';

const data = d3
  .dsvFormat(';')
  .parse(fs.readFileSync('./je-d-21.03.01.csv', 'utf-8'))
  .map((entry) => {
    for (let k in entry) {
      const parsed = parseFloat(entry[k].replace('’', ''));
      if (!isNaN(parsed)) {
        entry[k] = parsed;
      }
    }
    return entry;
  });

fs.writeFileSync(
  'municipality_metrics.json',
  JSON.stringify(data, null, 2),
  'utf-8',
);

console.log(data);
