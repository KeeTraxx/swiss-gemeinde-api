<script lang="ts">
  import AutoComplete from 'simple-svelte-autocomplete';
  import { query, metric } from './store';
  import combined from '../../data/combined.json';

  let isActive = false;

  let municipality = undefined;
  let radius = 10;

  let selectedMetric = 'census_population';
  metric.subscribe((m) => (selectedMetric = m));

  query.subscribe((q) => {
    municipality = q.municipality;
    radius = q.radius;
  });

  function send() {
    query.set({ municipality, radius });
  }
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img alt="sgi" src="/logo.png" height="28" />
    </a>

    <a
      role="button"
      href="#burger"
      class="navbar-burger {isActive ? 'is-active' : ''}"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample"
      on:click={() => (isActive = !isActive)}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div
    id="navbarBasicExample"
    class="navbar-menu {isActive ? 'is-active' : ''}"
  >
    <div class="navbar-start">
      <div class="navbar-item">
        <AutoComplete
          items={combined.features}
          labelFunction={(f) => f.properties.name}
          bind:selectedItem={municipality}
        />
      </div>
      <div class="navbar-item">
        <input
          class="input"
          type="number"
          bind:value={radius}
          placeholder="Radius"
          style="max-width: 5em;"
        />
      </div>
      <div class="navbar-item">
        <input class="button" type="button" value="Suchen" on:click={send} />
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <select
          class="select"
          bind:value={selectedMetric}
          on:change={() => metric.set(selectedMetric)}
        >
          <optgroup label="Bevölkerung">
            <option value="census_population">Einwohner 2019</option>
            <option value="census_change_%">Veränderung [%] 2010-2019</option>
            <option value="census_density_km2">
              Bevölkerungsdichte [pro km²] 2019
            </option>
            <option value="census_foreigners_%">Ausländerquote [%] 2019</option>
          </optgroup>
          <optgroup label="Altersverteilung">
            <option value="age_0-19_%">0 - 19 Jahre [%] 2019</option>
            <option value="age_20-64_%">20 - 64 Jahre [%] 2019</option>
            <option value="age_65_over_%">65 Jahre und mehr [%] 2019</option>
          </optgroup>
          <optgroup label="Bevölkerungsbewegung (‰)">
            <option value="status_marriage_promille"
              >Rohe Heiratsziffer 2019
            </option>
            <option value="status_divorce_promille">
              Rohe Scheidungsziffer 2019
            </option>
            <option value="status_birthrate_promille">
              Rohe Geburtenziffer 2019
            </option>
            <option value="status_dying_promille">
              Rohe Sterbeziffer 2019
            </option>
          </optgroup>
          <optgroup label="Haushalte">
            <option value="households_private">
              Anzahl Privathaushalte 2019
            </option>
            <option value="household_size_average_persons">
              Durchschnittliche Anzahl Personen pro Haushalt 2019
            </option>
          </optgroup>
          <optgroup label="Fläache">
            <option value="area_total_km2">Gesamtfläche [km²] 2016</option>
            <option value="area_residential_%">
              Siedlungsfläche [%] 2004/09
            </option>
            <option value="area_change_ha">
              Veränderung Siedlungsfläche in (1979 - 2004) [ha]
            </option>
            <option value="area_agricultural_%">
              Landwirtschaftsfläche [%] 2004/09</option
            >
            <option value="area_agricultural_change_ha">
              Veränderung Landwirtschaftsfläche in (1979 - 2004) [ha]
            </option>
            <option value="area_forest_%">Wald und Gehölze [%] 2004</option>
            <option value="area_unproductive_%"
              >Unproduktive Fläche [%] 2004</option
            >
          </optgroup>
          <optgroup label="Wirtschaft">
            <option value="economy_employed_total"
              >Beschäftige Total 2018</option
            >
            <option value="economy_employed_sector1"
              >Beschäftigte 1. Sektor 2018</option
            >
            <option value="economy_employed_sector2"
              >Beschäftigte 2. Sektor 2018</option
            >
            <option value="economy_employed_sector3"
              >Beschäftigte 3. Sektor 2018</option
            >
            <option value="economy_businesses_total"
              >Arbeitsstätten total 2018</option
            >
            <option value="economy_businesses_sector1"
              >Arbeitsstätten 1. Sektor 2018</option
            >
            <option value="economy_businesses_sector2"
              >Arbeitsstätten 2. Sektor 2018</option
            >
            <option value="economy_businesses_sector3"
              >Arbeitsstätten 3. Sektor 2018</option
            >
          </optgroup>
          <optgroup label="Bau- und Wohnungswesen">
            <option value="residential_empty_residences"
              >Leerwohnungsziffer 2020</option
            >
            <option value="residential_new_residents_per_1000"
              >Neu gebaute Wohnungen pro 1000 Einwohner 2018</option
            >
          </optgroup>
          <optgroup label="Soziale Sicherheit">
            <option value="welfare_quote">Sozialhilfequote 2019</option>
          </optgroup>
          <optgroup label="Wähleranteile ausgewählter Parteien (Nationalrat)">
            <option value="voter_quote_fdp">FDP 2019</option>
            <option value="voter_quote_cvp">CVP 2019</option>
            <option value="voter_quote_sp">SP 2019</option>
            <option value="voter_quote_svp">SVP 2019</option>
            <option value="voter_quote_evp_csp">EVP/CSP 2019</option>
            <option value="voter_quote_glp">GLP 2019</option>
            <option value="voter_quote_bdp">BDP 2019</option>
            <option value="voter_quote_pda">PDA 2019</option>
            <option value="voter_quote_gps">GPS 2019</option>
            <option value="voter_quote_other_right_parties"
              >Andere Rechtsparteien 2019</option
            >
          </optgroup>
        </select>
      </div>
    </div>
  </div>
</nav>
