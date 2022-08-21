<script lang="ts">
  import AutoComplete from 'simple-svelte-autocomplete';
  import { _ } from 'svelte-i18n';
  import { query, metric, addToCompare } from './store';
  import combined from '../../data/combined.json';
  import metricGroups from '../../data/metrics.json';

  let isActive = false;

  let municipality = undefined;
  let radius = 10;
  let lang = 'de';

  let selectedMetric = 'census_population';
  metric.subscribe((m) => (selectedMetric = m));

  query.subscribe((q) => {
    municipality = q.municipality;
    radius = q.radius;
  });

  function send() {
    console.log('sending', { municipality, radius });
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
          onChange={send}
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
        <button class="button" on:click={() => addToCompare(municipality)}
          >{$_('ui.compare_municipality')}</button
        >
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
                <option value={m}>{$_(`metrics.${m}`)}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </div>
      <div class="navbar-item">
        <select
          class="select"
          bind:value={lang}
          on:change={() => metric.set(selectedMetric)}
        >
          {#each metricGroups as group}
            <optgroup label={$_(`metrics.${group.key}`)}>
              {#each group.metrics as m}
                <option value={m}>{$_(`metrics.${m}`)}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </div>
    </div>
  </div>
</nav>
