import {
  booleanContains,
  buffer,
  featureCollection,
  point,
} from '@turf/turf';
import booleanIntersects from '@turf/boolean-intersects';

import combined from '../../data/combined.json';

class MunicipalityRepository {
  constructor() {
  }

  public findById(id: number) {
    return combined.features.find((f) => f.id === id);
  }

  public findByName(name: string) {
    return combined.features.find((f) => f.properties.name === name);
  }

  public findAllNear(
    f,
    radius: number,
  ) {
    const grown = buffer(f, radius, { units: 'kilometers' });

    const nearMunicipalities = combined.features.filter((m) =>
      booleanIntersects(m, grown),
    );

    return featureCollection(nearMunicipalities);
  }

  public async findByGeolocation() {
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
