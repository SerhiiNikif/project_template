import { User } from '../../../models/users/entities/user.entity';
import { faker } from '@faker-js/faker';

export const userFactory = (): Partial<User> => ({
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: `+380${faker.string.numeric(9)}`,
});
