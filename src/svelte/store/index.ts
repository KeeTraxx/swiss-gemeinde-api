import { push, location } from 'svelte-spa-router';
import { writable, derived, get } from 'svelte/store';

export const metric = writable('census_population');
export const payload = writable('Bern');
export const route = writable('m');

location.subscribe((l) => {
  const matches = l.match(/\/([a-z]+)\/(.*?)\/(.*)/);
  if (matches) {
    console.log('matches', matches);
    console.log('match', get(route), matches[1]);
    if (get(route) !== matches[1]) {
      route.set(decodeURIComponent(matches[1]));
    }

    console.log(get(payload), matches[2]);

    if (get(payload) !== matches[2]) {
      payload.set(decodeURIComponent(matches[2]));
    }

    console.log(get(metric), matches[3]);

    if (get(metric) !== matches[3]) {
      metric.set(decodeURIComponent(matches[3]));
    }
  }
});

derived([route, payload, metric], (a) => a).subscribe(
  ([newRoute, newPayload, newMetric]) => {
    console.log([newRoute, newPayload, newMetric]);
    push(`/${newRoute}/${encodeURIComponent(newPayload)}/${encodeURIComponent(newMetric)}`)
});