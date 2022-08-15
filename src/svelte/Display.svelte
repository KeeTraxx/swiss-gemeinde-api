<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { scaleLinear, select } from 'd3';
  import { geoPath } from 'd3';
  import { geoMercator } from 'd3';
  export let data;
  let svg;
  let layerBorders;

  const proj = geoMercator();
  const drawer = geoPath().projection(proj);

  afterUpdate(() => {
    const scale = scaleLinear();
    if (!data) {
        return;
    }
    
    proj.fitSize([svg.clientWidth, svg.clientHeight ], data);
    select(layerBorders)
      .selectAll('path')
      .data(data.features)
      .join((enter) => enter.append('path'));
    redraw();
  });

  function redraw() {
    select(layerBorders)
      .selectAll('path')
      .attr('d', d => drawer(d));
  }

</script>

<svelte:window on:resize={redraw} />

<svg bind:this={svg}>
  <g bind:this={layerBorders} />
</svg>
