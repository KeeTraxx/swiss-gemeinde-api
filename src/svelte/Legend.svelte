<script lang="ts">
  import { afterUpdate } from 'svelte';
  export let scale;

  let ticks = [];

  afterUpdate(() => {
    redraw();
  });

  function redraw() {
    ticks = scale.ticks();
  }

  function c(t) {
    return scale(t);
  }
</script>

<svelte:window on:resize={redraw} />

<div>
  <ul>
    {#each ticks as tick}
      <li><span style="color: {c(tick)}">&#9632;</span> {tick}</li>
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
