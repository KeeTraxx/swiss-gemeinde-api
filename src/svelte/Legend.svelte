<script lang="ts">
  import { afterUpdate } from 'svelte';
  import {formatByField} from './number-format';

  export let metric;
  let ticks = [];
  export let scale;

</script>

<div>
  <ul>
    {#each scale.ticks() as tick}
      <li><span style="color: {scale(tick)}">&#9632;</span> {formatByField(metric)(tick)}</li>
    {/each}
  </ul>
</div>

<style lang="scss">
  div {
    position: fixed;
    right: 2em;
    bottom: 2em;
    padding: 0.5em;
    border: 2px solid rgba(0,0,0,0.3);
    border-radius: 0.5em;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.3);
    background-color: rgba(255,255,255, 0.6);
  }
</style>
