import { buffer, centroid, circle } from '@turf/turf';
import {
  color,
  geoMercator,
  geoPath,
  interpolateRainbow,
  interpolateSpectral,
  json,
  scaleLinear,
  schemeCategory10,
  select,
} from 'd3';

const proj = geoMercator();
const drawer = geoPath().projection(proj);

async function query(municipality, radius = 10) {
  if (municipality.length < 3) return;
  const featureCollection = await json(
    `/.netlify/functions/near?${new URLSearchParams({
      municipality,
      radius,
      details: true,
    })}`,
  );
  const scale = scaleLinear().domain([0, featureCollection.features.length]);

  const svg = select('svg');
  console.log(svg.node().clientWidth, svg.node().clientHeight);

  proj.fitSize(
    [svg.node().clientWidth, svg.node().clientHeight],
    featureCollection,
  );

  select('#container')
    .selectAll('path')
    .data(featureCollection.features, (d) => d.id)
    .join((enter) =>
      enter
        .append('path')
        .style('fill', (_, i) => color(interpolateRainbow(scale(i))))
        .style('stroke', (_, i) =>
          color(interpolateRainbow(scale(i))).brighter(1),
        ),
    );

  select('#labels')
    .selectAll('text')
    .data(featureCollection.features, (d) => d.id)
    .join((enter) => enter.append('text').text((d) => d.properties.name));

  select('#radius').datum(
    circle(
      centroid(
        featureCollection.features.find(
          (d) => d.properties.name === municipality,
        ),
      ),
      radius,
      { units: 'kilometers' },
    ),
  );

  redraw();
}

function redraw() {
  select('#container')
    .selectAll('path')
    .attr('d', (d) => drawer(d));

  select('#labels')
    .selectAll('text')
    .attr('transform', (d) => `translate(${drawer.centroid(d)})`);

  select('#radius').attr('d', (d) => drawer(d));
}

select('#button').on('click', () =>
  query(
    select('#input').property('value'),
    parseInt(select('#radiusInput').property('value')),
  ),
);
