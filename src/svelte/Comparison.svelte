<script lang="ts">
  let municipalities = [];
  import GeoJsonViewer from './GeoJsonViewer.svelte';
  import { compare, removeFromCompare } from './store';
  import metricGroups from '../../data/metrics.json';
  console.log(metricGroups);

  compare.subscribe((m) => (municipalities = m));
</script>

{#if municipalities.length > 0}
  <aside class="container p-4">
    <table class="table">
      <tr>
        <th>&nbsp;</th>
        {#each municipalities as m}
          <td
            >{m.properties.name}
            <span on:click={() => removeFromCompare(m)}>X</span></td
          >
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
          <th>{group.key}</th>
        </tr>
        {#each group.metrics as metric}
        <tr>
          <th>{metric}</th>
          {#each municipalities as m}
          <td>{m.properties[metric]}</td>
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
  }
</style>
