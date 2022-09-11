<script lang="ts">
  import {afterUpdate} from 'svelte';
  import {link} from 'svelte-spa-router';
  import { _ } from 'svelte-i18n';
  import { metric, addToCompare, compare } from './store';
  import { get } from 'svelte/store';
  export let inspect;
  let m;
  let municipalityIds = [];
  metric.subscribe((selectedMetric) => {
    console.log(selectedMetric, inspect);
    m = inspect?.properties[selectedMetric];
  });

  compare.subscribe(all => municipalityIds = all.map(d => d.id));

  afterUpdate(() => {
    m = inspect?.properties[get(metric)];
  });
</script>

{#if inspect}
  <div class="container">
    <h3>{inspect.properties.name}</h3>
    <p>{m}</p>
    <button class="button" on:click={() => addToCompare(inspect)}>
      {$_('ui.compare_municipality')}
    </button>
    <a href="/compare/{$compare.map(d => d.properties.name).map(encodeURIComponent).join('|')}/${metric}" use:link>Compare {municipalityIds.length} municipalities</a>
  </div>
{/if}

<style>
  div.container {
    position: fixed;
    top: calc(30%);
    left: 50%;
    transform: translate(-50%, 0);
    padding: 0.2em 0.5em;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 0.5em;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  h3 {
    font-weight: bold;
  }
</style>
