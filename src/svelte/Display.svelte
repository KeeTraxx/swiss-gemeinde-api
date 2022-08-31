<script lang="ts">
  import './Display.scss';
  import Inspector from './Inspector.svelte';
  import { onMount } from 'svelte';
  import {
    extent,
    format,
    scaleLinear,
    scaleDiverging,
    select,
    interpolateRdYlGn,
  } from 'd3';
  import { buffer } from '@turf/turf';
  import { geoPath } from 'd3';
  import { geoMercator } from 'd3';
  import Legend from './Legend.svelte';
  import { results, metric, query } from './store';
  import { derived, get } from 'svelte/store';

  const rAndM = derived([results, metric], (a) => a);

  let inspect = undefined;

  let svg;
  let layerBorders;
  let layerLabels;
  let layerMetrics;

  const proj = geoMercator();
  const drawer = geoPath().projection(proj);
  let scale = scaleLinear();
  const numberFormatter = format(',');

  onMount(() => {
    rAndM.subscribe(([fc, m]) => {
      if (!fc) {
        return;
      }

      let ext = extent(fc.features, (d) => d.properties[m]);
      if (ext[0] < 0) {
        scale = scaleDiverging(interpolateRdYlGn).domain([ext[0], 0, ext[1]]);
      } else {
        scale = scaleLinear().domain(ext).range(['#fff', '#0f0']);
      }

      onResize();
      select(layerBorders)
        .selectAll('path')
        .data(fc.features, (d) => d.id)
        .join((enter) =>
          enter
            .append('path')
            .style('opacity', 0)
            .on('click', (ev, d) => {
              query.update((q) => ({
                municipality: d,
                radius: q.radius,
              }));
              inspect = d;
            })
            .transition('fade')
            .delay((d, i) => 300 + 10 * i)
            .style('opacity', 1),
        );

      select(layerLabels)
        .selectAll('text')
        .data(fc.features, (d) => d.id)
        .join((enter) =>
          enter
            .append('text')
            .text((d) => d.properties.name)
            .style('opacity', 0)
            .attr('transform', (d) => `translate(${drawer.centroid(d)})`)
            .transition('fade')
            .delay((d, i) => 300 + 10 * i)
            .style('opacity', 1),
        );

      select(layerMetrics)
        .selectAll('text')
        .data(fc.features, (d) => d.id)
        .join((enter) =>
          enter
            .append('text')
            .text((d) => d.properties.name)
            .style('opacity', 0)
            .attr('y', '1.2em')
            .attr('transform', (d) => `translate(${drawer.centroid(d)})`)
            .transition('fade')
            .delay((d, i) => 300 + 10 * i)
            .style('opacity', 1),
        );
      redraw();
    });
  });

  function onResize() {
    console.log(buffer(get(query).municipality, 4, { units: 'kilometers' }));
    proj.fitSize(
      [svg.clientWidth, svg.clientHeight],
      buffer(get(query).municipality, 4, { units: 'kilometers' }),
    );
    select(svg).append('path')
      .datum([buffer(get(query).municipality, 4, { units: 'kilometers' })])
      .attr('d', d => drawer(d))
    redraw();
  }

  function redraw() {
    select(layerBorders)
      .selectAll('path')
      .transition('move')
      .attr('d', (d) => drawer(d))
      .style('fill', (d) => scale(d.properties[get(metric)]));

    select(layerLabels)
      .selectAll('text')
      .transition('move')
      .attr('transform', (d) => `translate(${drawer.centroid(d)})`);

    select(layerMetrics)
      .selectAll('text')
      .transition('move')
      .text((d) => numberFormatter(d.properties[get(metric)]))
      .attr('transform', (d) => `translate(${drawer.centroid(d)})`);
  }
</script>

<svelte:window on:resize={() => onResize()} />

<Inspector {inspect} />
<svg bind:this={svg}>
  <g bind:this={layerBorders} />
  <g bind:this={layerLabels} />
  <g bind:this={layerMetrics} />
</svg>
<Legend {scale} />
