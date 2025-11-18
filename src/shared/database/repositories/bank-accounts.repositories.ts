import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from 'generated/prisma';

@Injectable()
export class BankAccountsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T extends Prisma.BankAccountFindManyArgs>(
    findManyArgs: Prisma.SelectSubset<T, Prisma.BankAccountFindManyArgs>,
  ) {
    return this.prismaService.bankAccount.findMany(findManyArgs);
  }

  findFirst(findFirstArgs: Prisma.BankAccountFindFirstArgs) {
    return this.prismaService.bankAccount.findFirst(findFirstArgs);
  }

  create(createArgs: Prisma.BankAccountCreateArgs) {
    return this.prismaService.bankAccount.create(createArgs);
  }

  update(updateArgs: Prisma.BankAccountUpdateArgs) {
    return this.prismaService.bankAccount.update(updateArgs);
  }

  delete(deleteArgs: Prisma.BankAccountDeleteArgs) {
    return this.prismaService.bankAccount.delete(deleteArgs);
  }
}
