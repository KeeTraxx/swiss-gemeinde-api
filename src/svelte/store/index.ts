import {
  buffer,
  featureCollection,
  FeatureCollection,
  MultiPolygon,
} from '@turf/turf';
import { writable, derived } from 'svelte/store';
import combined from '../../../data/combined.json';
import booleanIntersects from '@turf/boolean-intersects';

export interface Metrics {
  id: number;
  name: string;
  census_population: number;
  'census_change_%': number;
  census_density_km2: number;
  'census_foreigners_%': number;
  'age_0-19_%': number;
  'age_20-64_%': number;
  'age_65_over_%': number;
  status_marriage_promille: number;
  status_divorce_promille: number;
  status_birthrate_promille: number;
  status_dying_promille: number;
  households_private: number;
  household_size_average_persons: number;
  area_total_km2: number;
  'area_residential_%': number;
  area_change_ha: number;
  'area_agricultural_%': number;
  area_agricultural_change_ha: number;
  'area_forest_%': number;
  'area_unproductive_%': number;
  economy_employed_total: number;
  economy_employed_sector1: number;
  economy_employed_sector2: number;
  economy_employed_sector3: number;
  economy_businesses_total: number;
  economy_businesses_sector1: number;
  economy_businesses_sector2: number;
  economy_businesses_sector3: number;
  residential_empty_residences: number;
  residential_new_residents_per_1000: number;
  welfare_quote: number;
  voter_quote_fdp: number;
  voter_quote_cvp: number;
  voter_quote_sp: number;
  voter_quote_svp: number;
  voter_quote_evp_csp: number;
  voter_quote_glp: number;
  voter_quote_bdp: number;
  voter_quote_pda: number;
  voter_quote_gps: number;
  voter_quote_other_right_parties: number;
}

export const query = writable({
  municipality: 'Bätterkinden',
  radius: 10,
});

export const results = derived(query, ({ municipality, radius }) => {
  const m = combined.features.find((d) => d.properties.name === municipality);

  const grown = buffer(m, radius, { units: 'kilometers' });

  const nearMunicipalities = combined.features.filter((m) =>
    booleanIntersects(m, grown),
  );

  return featureCollection<MultiPolygon, Metrics>(nearMunicipalities);
});

export const metric = writable('census_population');
