import { push, location } from 'svelte-spa-router';
import {
  Feature,
  MultiPolygon,
} from '@turf/turf';
import { writable, derived } from 'svelte/store';
import { Metrics } from '../metrics';

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

export const metric = writable('census_population');

export const payload = writable('Bern');

export const route = writable( 'm');

derived([route, payload, metric], a => {
  console.log('a', a);
  return a
} ).subscribe(([newRoute, newPayload, newMetric]) => {
  push(`/${newRoute}/${encodeURIComponent(newPayload)}/${encodeURIComponent(newMetric)}`)
});