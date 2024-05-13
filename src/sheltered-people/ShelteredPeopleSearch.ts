import { Prisma } from '@prisma/client';
import { IFilterFormProps } from './types/search.types';

class ShelteredPeopleSearch {
  private formProps: Partial<IFilterFormProps>;

  constructor(props: Partial<IFilterFormProps> = {}) {
    this.formProps = { ...props };
  }

  get search(): Prisma.ShelteredPeopleWhereInput[] {
    if (!this.formProps.search) return [];
    else
      return [
        {
          address: {
            contains: this.formProps.search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: this.formProps.search,
            mode: 'insensitive',
          },
        },
      ];
  }

  get query(): Prisma.ShelteredPeopleWhereInput {
    if (Object.keys(this.formProps).length === 0) return {};
    return {
      AND: [{ OR: this.search }],
    };
  }
}

export { ShelteredPeopleSearch };
