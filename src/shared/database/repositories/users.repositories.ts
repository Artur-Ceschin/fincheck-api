import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from 'generated/prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createUserDto);
  }

  findUnique(findUniqueArgs: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(findUniqueArgs);
  }
}
