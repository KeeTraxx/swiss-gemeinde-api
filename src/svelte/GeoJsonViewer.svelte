<script lang="ts">
  import { geoPath, select } from 'd3';
  import { geoMercator } from 'd3';
  import { afterUpdate } from 'svelte';
  export let geoJson;
  let pathEl;
  const proj = geoMercator();
  const drawer = geoPath().projection(proj);
  afterUpdate(() => {
    proj.fitSize([960, 500], geoJson);
    select(pathEl)
      .datum(geoJson)
      .attr('d', (d) => drawer(d));
  });
</script>

<svg viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
  <path bind:this={pathEl} />
</svg>
