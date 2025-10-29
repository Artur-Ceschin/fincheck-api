import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from 'generated/prisma';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(findManyArgs: Prisma.CategoryFindManyArgs) {
    return this.prismaService.category.findMany(findManyArgs);
  }

  findFirst(findFirstArgs: Prisma.CategoryFindFirstArgs) {
    return this.prismaService.category.findFirst(findFirstArgs);
  }
}
