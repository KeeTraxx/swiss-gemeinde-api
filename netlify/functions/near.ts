import { Handler } from '@netlify/functions';
import { features as municipalities } from '../../data/combined.json';
import { buffer, featureCollection } from '@turf/turf';
import booleanIntersects from '@turf/boolean-intersects';

const handler: Handler = async (event, context) => {
  if (!event.queryStringParameters.municipality) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'No muicipality name!' }),
    };
  }

  const municipalityName = event.queryStringParameters.municipality;

  const radius = event.queryStringParameters.radius
    ? parseInt(event.queryStringParameters.radius)
    : 10;

  const municipality = municipalities.find(
    (d) => d.properties.name === municipalityName,
  );

  const grown = buffer(municipality, radius, { units: 'kilometers' });

  const nearMunicipalities = municipalities.filter((m) =>
    booleanIntersects(m, grown),
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
    body: event.queryStringParameters.details
      ? JSON.stringify(featureCollection(nearMunicipalities))
      : JSON.stringify(nearMunicipalities.map((d) => d.properties.name)),
  };
};

export { handler };
