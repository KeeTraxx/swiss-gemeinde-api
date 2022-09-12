<script lang="ts">
    import {afterUpdate} from 'svelte';

  import AutoComplete from 'simple-svelte-autocomplete';
  import { _, locale } from 'svelte-i18n';
  import { route, metric, payload } from './store';
  import combined from '../../data/combined.json';
  import metricGroups from '../../data/metrics.json';
  import municipalityService from './municipality.service';

  let isActive = false;

  let municipality = undefined;
  let lang = $locale;

  export let selectedMetric = 'census_population';
  metric.subscribe((m) => (selectedMetric = m));

  function changeLang(l) {
    window.localStorage.setItem('lang', l);
    $locale = l;
  }

  function onSelectMunicipality(f) {
    if (!f) {
      return;
    }
    if ($route === 'c') {
      if (!$payload.split('|').includes(f.properties.name)) {
        $payload = `${$payload}|${f.properties.name}`
      }
    } else {
      $payload = f.properties.name;
    }
  }

  afterUpdate(() => {
    municipality = municipalityService.findByName($payload);
  });
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
          onChange={onSelectMunicipality}
        />
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <select
          class="select"
          bind:value={selectedMetric}
          on:change={() => metric.set(selectedMetric)}
        >
          {#each metricGroups as group}
            <optgroup label={$_(`metrics.${group.key}`)}>
              {#each group.metrics as m}
                <option value={m.name}>{$_(`metrics.${m.name}`)}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </div>
      <div class="navbar-item">
        <select
          class="select"
          bind:value={lang}
          on:change={() => changeLang(lang)}
        >
          <option>de</option>
          <option>fr</option>
          <option>it</option>
          <option>en</option>
        </select>
      </div>
    </div>
  </div>
</nav>
