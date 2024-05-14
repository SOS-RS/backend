import { PickType } from '@nestjs/swagger';
import { CreateShelterDTO } from './CreateShelterDTO';

export class UpdateShelterDTO extends PickType(CreateShelterDTO, [
  'petFriendly',
  'shelteredPeople',
]) {}
