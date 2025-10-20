import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { color, initialBalance, name, type } = createBankAccountDto;

    return this.bankAccountsRepository.create({
      data: {
        color,
        initialBalance,
        name,
        type,
        // Keep userId below; if userId also appears above, this value will override it
        userId,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.bankAccountsRepository.findMany({ where: { userId } });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateBankAccountOwnership(userId, bankAccountId);

    const { color, initialBalance, name, type } = updateBankAccountDto;

    return this.bankAccountsRepository.update({
      where: { id: bankAccountId },
      data: {
        color,
        initialBalance,
        name,
        type,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnership(userId, bankAccountId);

    await this.bankAccountsRepository.delete({
      where: { id: bankAccountId },
    });

    return null;
  }

  private async validateBankAccountOwnership(
    userId: string,
    bankAccountId: string,
  ) {
    const isOwner = await this.bankAccountsRepository.findFirst({
      where: { id: bankAccountId, userId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found.');
    }
  }
}
