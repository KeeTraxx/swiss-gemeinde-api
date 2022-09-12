<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { payload, route, metric } from './store';
  export let inspect;

  function navigateToCompare() {
    $route = 'c';
    $payload = inspect.properties.name;
  }
</script>

{#if inspect}
  <div class="container">
    <h3>{inspect.properties.name}</h3>
    <p>{inspect.properties[$metric]}</p>
    <button class="button" on:click={() => navigateToCompare()}>
      {$_('ui.compare_municipality')}
    </button>
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
