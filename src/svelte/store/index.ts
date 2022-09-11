import {
  booleanContains,
  buffer,
  Feature,
  featureCollection,
  MultiPolygon,
  point,
} from '@turf/turf';
import { writable, derived } from 'svelte/store';
import combined from '../../../data/combined.json';
import booleanIntersects from '@turf/boolean-intersects';
import { extent, interpolateRdYlGn, interpolateYlGn, scaleDiverging } from 'd3';
import { Metrics } from '../metrics';

export const query = writable<{
  municipality: Feature<MultiPolygon, Metrics>;
  radius: number;
}>({
  municipality: combined.features.find((d) => d.properties.name === 'Bern'),
  radius: 15,
});

export const compare = writable<Array<Feature<MultiPolygon, Metrics>>>([]);

export function addToCompare(municipality: Feature<MultiPolygon, Metrics>) {
  compare.update((all) =>
    !all.includes(municipality) ? [...all, municipality] : all,
  );
}

export function removeFromCompare(
  municipality: Feature<MultiPolygon, Metrics>,
) {
  compare.update((all) => all.filter((d) => d.id !== municipality.id));
}

export const results = derived(query, ({ municipality, radius }) => {
  const grown = buffer(municipality, radius, { units: 'kilometers' });

  const nearMunicipalities = combined.features.filter((m) =>
    booleanIntersects(m, grown),
  );

  return featureCollection<MultiPolygon, Metrics>(nearMunicipalities);
});

export const metric = writable('census_population');

export const scale = derived([results, metric], ([fc, m]) => {
  let ext = extent(fc.features, (d) => d.properties[m]);
  if (ext[0] < 0) {
    return scaleDiverging(interpolateRdYlGn).domain([ext[0], 0, ext[1]]);
  } else {
    return scaleDiverging(interpolateYlGn).domain([ext[0], (ext[0] + ext[1]) / 2, ext[1]]);
  }
})