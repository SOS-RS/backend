import { generateMock } from '@anatine/zod-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import { ShelterSchema } from 'src/shelter/types/types';
import { SupplyCategorySchema } from 'src/supply-categories/types';
import { SupplySchema } from 'src/supply/types';
import { PrismaService } from '../prisma/prisma.service';
import * as helpers from './shelter-csv-importer.helpers';
import { ShelterCsvImporterService } from './shelter-csv-importer.service';

describe('ShelterCsvImporterService', () => {
  let service: ShelterCsvImporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterCsvImporterService],
    })
      .useMocker((token) => {
        if (token !== PrismaService) return;

        return {
          shelter: {
            create: jest.fn().mockResolvedValue(generateMock(ShelterSchema)),
          },
          supply: {
            findMany: jest.fn().mockResolvedValue([generateMock(SupplySchema)]),
          },
          supplyCategory: {
            findMany: jest
              .fn()
              .mockResolvedValue([generateMock(SupplyCategorySchema)]),
          },
          $transaction: jest
            .fn(PrismaService.prototype.$transaction)
            .mockResolvedValue([
              [generateMock(SupplyCategorySchema)],
              [generateMock(SupplySchema)],
            ]),
        };
      })
      .compile();

    service = module.get<ShelterCsvImporterService>(ShelterCsvImporterService);
  });

  test('test_shelterToCsv_withoutRequiredInputs', async () => {
    await expect(service.execute({ headers: {} } as any)).rejects.toThrow(
      'Um dos campos `csvUrl` ou `fileStream` é obrigatório',
    );
  });

  test('test_shelterToCsv_withValidFileStream', async () => {
    const mockFileStream = new Readable();
    mockFileStream.push('name,address,lat,lng,number,street, capacity\n');
    mockFileStream.push('name,address,1.0214,1.54525, 1234, Street,10.123');
    mockFileStream.push(null);

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      body: mockFileStream,
    } as any);

    jest
      .spyOn(helpers, 'detectSupplyCategoryUsingAI')
      .mockResolvedValueOnce(
        require('examples/gemini_prompt_response_example.json'),
      );

    const result = await service.execute({
      fileStream: mockFileStream,
      headers: {
        nameField: 'name',
        addressField: 'address',
        latitudeField: 'lat',
        longitudeField: 'lng',
        streetField: 'street',
        streetNumberField: 'number',
        capacityField: 'capacity',
      },
    });

    expect(result.failureCount).toBe(0);
    expect(result.successCount).toBeGreaterThan(0);
    expect(result.totalCount).toBeGreaterThan(0);
  });

  test('test_shelterToCsv_missingSuppliesCategorization', async () => {
    const mockFileStream = new Readable();
    mockFileStream.push('name,address,lat,lng,supplies, UnknownSupply\n');
    mockFileStream.push('name,address,1.0214,1.54525, UnknownSupply');
    mockFileStream.push(null);

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      body: mockFileStream,
    } as any);

    jest.spyOn(helpers, 'detectSupplyCategoryUsingAI').mockResolvedValue({
      UnknownSupply: ['NewCategory'],
    });

    const result = await service.execute({
      fileStream: mockFileStream,
      headers: {
        nameField: 'name',
        addressField: 'address',
        latitudeField: 'lat',
        shelterSuppliesField: 'supplies',
        longitudeField: 'lng',
      },
    });

    expect(result.failureCount).toBe(0);
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.successCount).toBeGreaterThan(0);
  });
});
