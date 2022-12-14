<script lang="ts">
  import './Display.scss';
  import Inspector from './Inspector.svelte';
  import { afterUpdate } from 'svelte';
  import { payload } from './store';
  import {
    extent,
    interpolateRdYlGn,
    interpolateYlGn,
    scaleDiverging,
    select,
type ExtendedFeature,
  } from 'd3';
  import {
    buffer,
    rewind,
    type Feature,
    type FeatureCollection,
    type Geometry,
  } from '@turf/turf';
  import { geoPath } from 'd3';
  import { geoMercator } from 'd3';
  import Legend from './Legend.svelte';
  import municipalityService from './municipality.service';
  import { formatByField } from './number-format';
  import type { Metrics } from './metrics';
  export let params;

  let inspect : Feature<Geometry, Metrics> = undefined;

  let svg;
  let layerBorders;
  let layerLabels;
  let layerMetrics;

  const proj = geoMercator();
  const drawer = geoPath().projection(proj);

  let municipality;
  let metric : string;
  let scale;
  let fc: FeatureCollection<Geometry, Metrics>;

  payload.subscribe(() => (inspect = undefined));

  afterUpdate(() => {
    municipality = municipalityService.findByName(params.municipalityName);
    metric = params.metric;
    if (!municipality || !metric) {
      return;
    }
    fc = municipalityService.findAllNear(municipality, 15);
    scale = getScale();
    onResize();

    select(layerBorders)
      .selectAll<SVGPathElement, Feature<Geometry, Metrics>>('path')
      .data(fc.features, (d) => d.id)
      .join((enter) =>
        enter
          .append('path')
          .style('opacity', 0)
          .on('click', (ev, d) => {
            // push(`/m/${encodeURIComponent(d.properties.name)}/${encodeURIComponent(metric)}`);
            $payload = d.properties.name;
            inspect = d;
          })
          .transition('fade')
          .delay((d, i) => 300 + 10 * i)
          .style('opacity', 1),
      );

    select(layerLabels)
      .selectAll<SVGTextElement, Feature<Geometry, Metrics>>('text')
      .data(fc.features, (d) => d.id)
      .join((enter) =>
        enter
          .append('text')
          .text((d) => d.properties.name)
          .style('opacity', 0)
          .attr('transform', (d) => `translate(${drawer.centroid(d as ExtendedFeature)})`)
          .transition('fade')
          .delay((d, i) => 300 + 10 * i)
          .style('opacity', 1),
      );

    select(layerMetrics)
      .selectAll<SVGTextElement, Feature<Geometry, Metrics>>('text')
      .data(fc.features, (d) => d.id)
      .join((enter) =>
        enter
          .append('text')
          .style('opacity', 0)
          .attr('y', '1.2em')
          .attr('transform', (d) => `translate(${drawer.centroid(d as ExtendedFeature)})`)
          .transition('fade')
          .delay((d, i) => 300 + 10 * i)
          .style('opacity', 1),
      );
    redraw();
  });

  function getScale() {
    let ext = extent(fc.features, (d) => d.properties[metric]);
    if (ext[0] < 0) {
      return scaleDiverging(interpolateRdYlGn).domain([ext[0], 0, ext[1]]);
    } else {
      return scaleDiverging(interpolateYlGn).domain([
        ext[0],
        (ext[0] + ext[1]) / 2,
        ext[1],
      ]);
    }
  }

  function onResize() {
    const growed = buffer(municipality, 8, { units: 'kilometers' });
    rewind(growed, { reverse: true, mutate: true });
    proj.fitSize([svg.clientWidth, svg.clientHeight], growed);
    redraw();
  }

  function redraw() {
    select(layerBorders)
      .selectAll<SVGPathElement, Feature<Geometry, Metrics>>('path')
      .transition('move')
      .attr('d', (d) => drawer(d as ExtendedFeature))
      .style('fill', (d) => scale(d.properties[metric]));

    select(layerLabels)
      .selectAll<SVGTextElement, Feature<Geometry, Metrics>>('text')
      .transition('move')
      .attr('transform', (d) => `translate(${drawer.centroid(d as ExtendedFeature)})`);

    select(layerMetrics)
      .selectAll<SVGTextElement, Feature<Geometry, Metrics>>('text')
      .text((d) => formatByField(metric)(d.properties[metric]))
      .transition('move')
      .attr('transform', (d) => `translate(${drawer.centroid(d as ExtendedFeature)})`);
  }
</script>

<svelte:window on:resize={() => onResize()} />

<svelte:head>
  <title>SGI - {municipality?.properties?.name}</title>
</svelte:head>

<Inspector inspect={inspect} />
<svg bind:this={svg}>
  <g bind:this={layerBorders} />
  <g bind:this={layerLabels} />
  <g bind:this={layerMetrics} />
</svg>
{#if scale}
  <Legend {scale} {metric} />
{/if}
