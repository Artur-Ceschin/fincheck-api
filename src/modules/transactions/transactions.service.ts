import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateBankAccountOwnershipService } from '../bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from '../categories/services/validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId } = createTransactionDto;
    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
    });

    return this.transactionsRepo.create({
      data: {
        ...createTransactionDto,
        userId: userId,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.transactionsRepo.findMany({ where: { userId } });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsRepo.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.transactionsRepo.delete({ where: { id } });
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
  }: {
    userId: string;
    bankAccountId: string;
    categoryId: string;
  }) {
    await Promise.all([
      this.validateBankAccountOwnershipService.validate(userId, bankAccountId),
      this.validateCategoryOwnershipService.validate(userId, categoryId),
    ]);
  }
}
