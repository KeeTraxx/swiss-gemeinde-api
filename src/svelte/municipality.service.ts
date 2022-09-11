import {
  booleanContains,
  buffer,
  Feature,
  FeatureCollection,
  featureCollection,
  Geometry,
  point,
  rewind
} from '@turf/turf';
import booleanIntersects from '@turf/boolean-intersects';

import combined from '../../data/combined.json';
import { Metrics } from './metrics';

class MunicipalityRepository {
  constructor() {
    console.log('CONSTRUCTED!');
  }

  public findById(id: number): Feature<Geometry, Metrics> {
    return combined.features.find((f) => f.id === id);
  }

  public findByName(name: string): Feature<Geometry, Metrics> {
    return combined.features.find((f) => f.properties.name === name);
  }

  public findAllNear(
    f: Feature,
    radius: number,
  ): FeatureCollection<Geometry, Metrics> {
    const grown = buffer(f, radius, { units: 'kilometers' });

    const nearMunicipalities = combined.features.filter((m) =>
      booleanIntersects(m, grown),
    );

    return featureCollection<Geometry, Metrics>(nearMunicipalities);
  }

  public async findByGeolocation(): Promise<Feature<Geometry, Metrics>> {
    if (navigator.geolocation) {
      return new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('got pos', pos);
            const municipality = combined.features
              .filter((f) => f.geometry.type === 'Polygon')
              .find((f) =>
                booleanContains(
                  f,
                  point([pos.coords.longitude, pos.coords.latitude]),
                ),
              );
            return resolve(municipality);
          },
          (err) =>
            // User denied Geolocation
            resolve(
              combined.features.find((d) => d.properties.name === 'Bern'),
            ),
        ),
      );
    } else {
      console.log('found?fallback');
      return combined.features.find((d) => d.properties.name === 'Bern');
    }
  }
}

export default new MunicipalityRepository();
