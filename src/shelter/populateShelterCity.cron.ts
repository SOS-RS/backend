import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PopulateShelterCity {
  private readonly logger = new Logger(PopulateShelterCity.name);
  private readonly geocodeApiKey = process.env.MAPS_CO_GEOCODE_API_KEY;
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async populateShelterCity() {
    const runId = Date.now();
    this.logger.log(`Running Populate Shelter City CRON (${runId})`);

    const shelter = await this.prismaService.shelter.findFirst({
      where: {
        city: null,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!shelter) {
      this.logger.log(`${runId} > No pending shelters found. Skipping...`);
      return;
    }
    this.logger.log(
      `${runId} > Processing data for shelter with ID '${shelter.id}'`,
    );

    const { latitude, longitude } = shelter;
    if (!latitude || !longitude) {
      this.logger.log(`${runId} > Inconsistent lat/long data. Skipping...`);
      return;
    }

    let geocodeData:
      | {
          city?: string;
          postCode?: string;
        }
      | undefined = undefined;

    try {
      geocodeData = await this.reverseGeocode({ latitude, longitude });
      if (!geocodeData.city) {
        this.logger.log(
          `${runId} > Missing city from geocode data. Skipping...`,
        );
        return;
      }
    } catch (error) {
      this.logger.error(error);
      this.logger.log(`${runId} > Error fetching geodata. Skipping...`);
      geocodeData = undefined;
    }
    if (!geocodeData) return;

    await this.prismaService.shelter.update({
      where: { id: shelter.id },
      data: geocodeData,
    });
    this.logger.log(`${runId} > Successfully updated geocode data.`);
  }

  private async reverseGeocode({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<{
    city?: string;
    street?: string;
    streetNumber?: string;
    neighbourhood?: string;
    stateDistrict?: string;
    zipCode?: string;
  }> {
    const reverseGeocodeURI = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${this.geocodeApiKey}`;

    const response = await fetch(reverseGeocodeURI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    return {
      city: data?.address.city,
      street: data?.address.road,
      streetNumber: data?.address.house_number,
      neighbourhood: data?.address.suburb,
      stateDistrict: data?.address.state_district,
      zipCode: data?.address.postcode,
    };
  }
}
