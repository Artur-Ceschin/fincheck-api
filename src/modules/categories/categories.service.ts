import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  //Develop the crud for this one
  findAllByUserId(userId: string) {
    return this.categoriesRepository.findMany({
      where: {
        userId,
      },
    });
  }
}
