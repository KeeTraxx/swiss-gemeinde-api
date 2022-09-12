import { format, formatDefaultLocale } from 'd3';
import metrics from '../../data/metrics.json';

const metricMap = new Map(metrics.flatMap(d => d.metrics)
  .map(metric => ([metric.name, metric])));

formatDefaultLocale({
  currency: ['', 'CHF'],
  decimal: '.',
  grouping: [3],
  thousands: "'",
  minus: '-',
  nan: '',
});

export function formatByField(name: string) {
  const metric = metricMap.get(name);
  return (val) => (val !== undefined && val!== null && !Number.isNaN(val)) ? `${format(metric.format)(val)}${metric.unit}` : '';
}
