import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterSearchPropsSchema } from 'src/shelter/types/search.types';
import { SearchSchema } from 'src/types';
import { parseTagResponse, ShelterSearch } from 'src/shelter/ShelterSearch';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { SupplyPriority } from 'src/supply/types';

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
    const { getQuery } = new ShelterSearch(this.prismaService, queryData);
    const where = await getQuery();

    const count = await this.prismaService.shelter.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.ShelterFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const allShelters = await this.prismaService.shelter.findMany({
      ...whereData,
      select: {
        id: true,
        name: true,
        pix: true,
        address: true,
        street: true,
        neighbourhood: true,
        city: true,
        streetNumber: true,
        zipCode: true,
        capacity: true,
        petFriendly: true,
        shelteredPeople: true,
        prioritySum: true,
        verified: true,
        latitude: true,
        longitude: true,
        actived: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        shelterSupplies: {
          where: {
            priority: {
              notIn: [SupplyPriority.UnderControl],
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          include: {
            supply: true,
          },
        },
      },
    });

    const allCategories = await this.prismaService.supplyCategory.findMany({
      select: {
        id: true,
        name: true,
        supplies: {
          select: {
            id: true,
            shelterSupplies: {
              select: {
                shelter: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
    });

    const categoriesWithDetailsPromises = allCategories.map(async (category) => {
      const supplies = category.supplies.flatMap(supply => supply.shelterSupplies);
      const sheltersWithSupplies = supplies.map(supply => supply.shelter);
    
      const sheltersRequesting = await this.prismaService.shelter.findMany({
        where: {
          shelterSupplies: {
            some: {
              supply: {
                supplyCategory: {
                  id: category.id
                }
              }
            }
          }
        },
        select: {
          id: true,
          name: true
        }
      });
    
      return {
        id: category.id,
        name: category.name,
        sheltersWithSupplies: sheltersWithSupplies,
        sheltersRequesting: sheltersRequesting
      };
    });

    const categoriesWithDetails = await Promise.all(categoriesWithDetailsPromises);


    return {
      allShelters: allShelters.length,
      categories: categoriesWithDetails
    };
  }
}