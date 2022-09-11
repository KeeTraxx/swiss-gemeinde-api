<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { _ } from 'svelte-i18n';

  import GeoJsonViewer from './GeoJsonViewer.svelte';
  import { compare, removeFromCompare, addToCompare } from './store';
  import metricGroups from '../../data/metrics.json';
  import combined from '../../data/combined.json';
  let municipalities = [];
  export let params;
  import municipalityService from './municipality.service';

  afterUpdate(() => {
    municipalities = params.municipalityNames.split('|')
      .map(municipalityService.findByName);
  });

</script>

{#if municipalities.length > 0}
  <aside class="container">
    <table class="table">
      <tr>
        <th>&nbsp;</th>
        {#each municipalities as m}
          <td class="metric">{m.properties.name}</td>
        {/each}
      </tr>
      <tr>
        <th>&nbsp;</th>
        {#each municipalities as m}
          <td class="metric">
            <button
              class="button is-danger"
              on:click={() => removeFromCompare(m)}>Entfernen</button
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
            <th>{$_(`metrics.${metric}`)}</th>
            {#each municipalities as m}
              <td class="metric">{m.properties[metric]}</td>
            {/each}
          </tr>
        {/each}
      {/each}
    </table>
  </aside>
{/if}

<style lang="scss">
  aside {
    position: fixed;
    top: 4em;
    left: 0;
    bottom: 0;
    overflow-y: auto;
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
