import * as d3 from 'd3';
import * as fs from 'fs';

const metrics = JSON.parse(
  fs.readFileSync('./data/metrics.json', 'utf-8'),
);

console.log(metrics);

const newMetrics = metrics.map(({key, metrics}) => ({key, metrics : metrics.map(name => ({name, format: ''}))}));

console.log(newMetrics);

fs.writeFileSync('newmetrics.json', JSON.stringify(newMetrics, null, 2), 'utf-8');