import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async index() {
    const allShelters = await this.prismaService.shelter.findMany({});

    const allPeopleSheltered = allShelters.reduce((accumulator, current) => {
      return accumulator + (current.shelteredPeople ?? 0);
    }, 0);

    let shelterAvailable = 0;
    let shelterFull = 0;
    let shelterWithoutInformation = 0;

    allShelters.forEach((shelter) => {
      if (shelter.shelteredPeople !== null && shelter.capacity !== null) {
        if (shelter.shelteredPeople < shelter.capacity) {
          shelterAvailable++;
        } else if (shelter.shelteredPeople >= shelter.capacity) {
          shelterFull++;
        }
      } else {
        shelterWithoutInformation++;
      }
    });

    return {
      allShelters: allShelters.length,
      allPeopleSheltered: allPeopleSheltered,
      shelterAvailable: shelterAvailable,
      shelterFull: shelterFull,
      shelterWithoutInformation: shelterWithoutInformation,
    };
  }
}
