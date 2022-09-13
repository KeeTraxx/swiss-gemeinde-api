<script lang="ts">
  import AutoComplete from 'simple-svelte-autocomplete';
  import { afterUpdate } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { payload, route } from './store';
  import GeoJsonViewer from './GeoJsonViewer.svelte';
  import metricGroups from '../../data/metrics.json';
  let municipalities = [];
  export let params;
  import municipalityService from './municipality.service';
  import { formatByField } from './number-format';
  import combined from '../../data/combined.json';

  let s;

  afterUpdate(() => {
    municipalities = params.municipalityNames
      .split('|')
      .map(municipalityService.findByName);
  });

  function removeFromCompare(f) {
    const newMunicipalities = params.municipalityNames
      .split('|')
      .filter((m) => m !== f.properties.name);

    if (newMunicipalities.length === 0) {
      $route = 'm';
    } else {
      $payload = newMunicipalities.join('|');
    }
  }

  function onSelectMunicipality(f) {
    console.log(f);
    if (!f) {
      return;
    }
    if (!$payload.split('|').includes(f.properties.name)) {
      s = null;
      $payload = `${$payload}|${f.properties.name}`;
    }
  }
</script>

<aside class="container">
  <table class="table">
    <tr>
      <th>&nbsp;</th>
      {#each municipalities as m}
        <td class="metric">{m.properties.name}</td>
      {/each}
      <th>
        <AutoComplete
          items={combined.features}
          labelFunction={(f) => f.properties.name}
          onChange={onSelectMunicipality}
          selectedItem={s}
          placeholder={$_('ui.compare_municipality')}
        />
      </th>
    </tr>
    <tr>
      <th>&nbsp;</th>
      {#each municipalities as m}
        <td class="metric">
          <button class="button is-danger" on:click={() => removeFromCompare(m)}
            >Entfernen</button
          >
        </td>
      {/each}
    </tr>
    <tr>
      <th>&nbsp;</th>
      {#each municipalities as m}
        <td>
          <GeoJsonViewer geoJson={m} />
        </td>
      {/each}
    </tr>
    {#each metricGroups as group}
      <tr>
        <th style="padding-top: 1.5em;" colspan="99">
          {$_(`metrics.${group.key}`)}
        </th>
      </tr>
      {#each group.metrics as metric}
        <tr>
          <th>{$_(`metrics.${metric.name}`)}</th>
          {#each municipalities as m}
            <td class="metric"
              >{formatByField(metric.name)(m.properties[metric.name])}</td
            >
          {/each}
        </tr>
      {/each}
    {/each}
  </table>
</aside>

<style lang="scss">
  aside {
    margin: 0;
  }
  td.metric {
    text-align: right;
    width: 10vw;
  }

  th {
    width: 10em;
  }

  tr:nth-child(1) > * {
    position: sticky;
    top: 0;
    background-color: white;
    min-width: 10em;
  }
  tr:nth-child(2) > * {
    position: sticky;
    top: 2em;
    background-color: white;
  }
  tr:nth-child(3) > * {
    position: sticky;
    top: 5em;
    background-color: white;
  }
</style>
