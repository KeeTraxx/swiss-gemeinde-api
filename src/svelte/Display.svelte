<script lang="ts">
  import './Display.scss';
  import { onMount } from 'svelte';
  import { extent, path, scaleLinear, select } from 'd3';
  import { geoPath } from 'd3';
  import { geoMercator } from 'd3';
  import Legend from './Legend.svelte';
  import { results, metric, query } from './store';
  import { derived, get } from 'svelte/store';

  const rAndM = derived([results, metric], (a) => a);

  let svg;
  let layerBorders;
  let layerLabels;

  const proj = geoMercator();
  const drawer = geoPath().projection(proj);
  let scale = scaleLinear().range(['#fff', '#0f0']).nice();

  onMount(() => {
    rAndM.subscribe(([fc, m]) => {
      if (!fc) {
        return;
      }

      scale = scale.copy();
      scale.domain(extent(fc.features, (d) => d.properties[m]));

      proj.fitSize([svg.clientWidth, svg.clientHeight], fc);
      select(layerBorders)
        .selectAll('path')
        .data(fc.features, (d) => d.id)
        .join((enter) =>
          enter
            .append('path')
            .style('opacity', 0)
            .on('click', (ev, d) =>
              query.update((q) => ({
                municipality: d.properties.name,
                radius: q.radius,
              })),
            )
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
      redraw();
    });
  });

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
  }
</script>

<svelte:window />
<svg bind:this={svg}>
  <g bind:this={layerBorders} />
  <g bind:this={layerLabels} />
</svg>
<Legend {scale} />
