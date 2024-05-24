import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function cryptPassword(params: Prisma.MiddlewareParams) {
  if (
    (params.action === 'create' || params.action === 'update') &&
    params.model === 'User' &&
    !!params.args.data.password
  ) {
    const user = params.args.data;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    params.args.data = user;
  }
}

const hooks = [cryptPassword];

export { hooks };
