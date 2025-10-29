import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepo: TransactionsRepository) {}

  create(userId: string, createTransactionDto: CreateTransactionDto) {
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
}
