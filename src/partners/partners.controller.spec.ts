import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { ServerResponse } from '../utils';

describe('PartnersController', () => {
  let controller: PartnersController;
  let service: PartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [PartnersService],
    })
      .overrideProvider(PartnersService)
      .useValue({
        index: jest.fn().mockResolvedValue([
          {
            id: 1,
            name: 'Partner 1',
            link: 'https://partner1.com',
          },
        ]),
        store: jest.fn().mockResolvedValue({}),
      })
      .compile();

    controller = module.get<PartnersController>(PartnersController);
    service = module.get<PartnersService>(PartnersService);
  });

  it('should return all partners', async () => {
    const expectedResponse = new ServerResponse(
      200,
      'Successfully get partners',
      [
        {
          id: 1,
          name: 'Partner 1',
          link: 'https://partner1.com',
        },
      ],
    );
    const result = await controller.index();
    expect(result).toEqual(expectedResponse);
  });

  it('should create a partner', async () => {
    const expectedResponse = new ServerResponse(
      201,
      'Successfully created partner',
    );
    const result = await controller.store({
      name: 'Partner 1',
      link: 'https://partner1.com',
    });
    expect(result).toEqual(expectedResponse);
  });

  it('should throw an error when store fails', async () => {
    const errorMessage = 'Failed to create partner';
    jest.spyOn(service, 'store').mockRejectedValue(new Error(errorMessage));
    await expect(
      controller.store({
        name: 'Partner 1',
        link: 'https://partner1.com',
      }),
    ).rejects.toThrow();
  });

  it('should throw an error when index fails', async () => {
    const errorMessage = 'Failed to get partners';
    jest.spyOn(service, 'index').mockRejectedValue(new Error(errorMessage));
    await expect(controller.index()).rejects.toThrow();
  });
});
