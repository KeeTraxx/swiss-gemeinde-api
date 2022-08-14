<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {json} from 'd3';

  let municipality = 'Bätterkinden';
  let radius = '10';

  const dispatch = createEventDispatcher();

  async function query() {
    // dispatch('onSubmit', {municipalityName, radius })
    const d = await json(
      `/.netlify/functions/near?${new URLSearchParams({
        municipality,
        radius,
        details: "true"
      })}`,
    );
    
    dispatch('dataReceived', d);
  }
</script>

<aside>
  <form>
    <label>
      Gemeinde
      <input class="input" type="text" bind:value={municipality} />
    </label>
    <label>
      Radius (km)
      <input class="input" type="number" bind:value={radius} />
    </label>
    <input class="button" type="button" value="Suchen" on:click={query} />
  </form>
</aside>

<style lang="scss">
  aside {
    position: fixed;
    right: 0;
    top: 0;
  }
</style>
