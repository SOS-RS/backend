

export class MapsApi {
  static key: string = process.env.MAPS_API_KEY || '';
  static url: string = process.env.MAPS_API_URL || 'https://maps.googleapis.com/maps/api';

  static async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    console.log(`${MapsApi.url}/geocode/json?address=${encodeURI(address)}&key=${MapsApi.key}`);
    
    return fetch(
      `${MapsApi.url}/geocode/json?address=${encodeURI(address)}&key=${MapsApi.key}`,
    ).then((res) => res.json())
      .then((res) => res['results'][0]['geometry']['location']);
  }
}

