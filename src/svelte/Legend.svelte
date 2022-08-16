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
  }
</style>
