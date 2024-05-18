import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterSearchPropsSchema } from 'src/shelter/types/search.types';
import { SearchSchema } from 'src/types';
import { ShelterSearch } from 'src/shelter/ShelterSearch';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(query: any) {
    const {
      order,
      orderBy,
      page,
      perPage,
      search: searchQuery,
    } = SearchSchema.parse(query);

    const queryData = ShelterSearchPropsSchema.parse(qs.parse(searchQuery));
    const { query: where } = new ShelterSearch(this.prismaService, queryData);

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const allShelters = await this.prismaService.shelter.findMany({
      ...whereData,
      include: { shelterSupplies: true },
    });

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
