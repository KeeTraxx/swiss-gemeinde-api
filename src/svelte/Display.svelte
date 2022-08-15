<script lang="ts">
  import './Display.scss';
  import { beforeUpdate } from 'svelte';
  import { extent, path, scaleLinear, select } from 'd3';
  import { geoPath } from 'd3';
  import { geoMercator } from 'd3';
  import Legend from './Legend.svelte';
  export let data;
  let displayedData;

  export let metric;
  let displayedMetric;
  let svg;
  let layerBorders;
  let layerLabels;

  const proj = geoMercator();
  const drawer = geoPath().projection(proj);
  let scale = scaleLinear().range(['#fff', '#0f0']).nice();

  beforeUpdate(() => {
    if (data !== displayedData) {
      dataUpdated();
      metricUpdated();
    }

    if (metric !== displayedMetric) {
      metricUpdated();
    }
    redraw();
  });

  function dataUpdated() {
    if (!data) {
      return;
    }
    displayedData = data;
    proj.fitSize([svg.clientWidth, svg.clientHeight], data);
    select(layerBorders)
      .selectAll('path')
      .data(displayedData.features, (d) => d.id)
      .join((enter) => enter.append('path'));

    select(layerLabels)
      .selectAll('text')
      .data(displayedData.features, (d) => d.id)
      .join((enter) =>
        enter
          .append('text')
          .text((d) => d.properties.name)
          .attr('transform', (d) => `translate(${drawer.centroid(d)})`),
      );
  }

  function metricUpdated() {
    if (!displayedData) {
      return;
    }
    displayedMetric = metric;
    scale = scale.copy();
    console.log('metric updated', displayedMetric);
    scale.domain(
      extent(displayedData.features, (d) => d.properties[displayedMetric]),
    );
    console.log(scale.domain());
  }

  function redraw() {
    select(layerBorders)
      .selectAll('path')
      .transition()
      .attr('d', (d) => drawer(d))
      .style('fill', (d) => scale(d.properties[displayedMetric]));

    select(layerLabels)
      .selectAll('text')
      .transition()
      .attr('transform', (d) => `translate(${drawer.centroid(d)})`);
  }
</script>

<svelte:window on:resize={redraw} />

<svg bind:this={svg}>
  <g bind:this={layerBorders} />
  <g bind:this={layerLabels} />
</svg>

{#if data}
<Legend {scale} />
{/if}