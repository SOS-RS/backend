export class MapsApi {
  static key: string = process.env.MAPS_API_KEY || '';
  static url: string = process.env.MAPS_API_URL || 'https://maps.googleapis.com/maps/api';

  static async getCoordinates(address: string): Promise<{ lat: number | null ; lng: number | null }> {
    try {
      const response = await fetch(`${MapsApi.url}/geocode/json?address=${encodeURI(address)}&key=${MapsApi.key}`);
      if (!response.ok) {
        throw new Error(`[MAPS API] Failed to fetch coordinates. Status: ${response.status}`);
      }
      
      const data = await response.json();
      const location = data?.results?.[0]?.geometry?.location;
      if (!location || !location.lat || !location.lng) {
        throw new Error('Invalid response from maps API');
      }

      return location;
    } catch (error: any) {
      console.error(`[MAPS API] Error fetching coordinates: ${error.message}`);
      return { lat: null, lng: null };
    }
  }
}

