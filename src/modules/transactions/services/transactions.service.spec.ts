import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';

const transactionsRepositoryMock = {
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findFirst: jest.fn(),
};

const validateBankAccountOwnershipServiceMock = {
  validate: jest.fn().mockResolvedValue(undefined),
};

const validateCategoryOwnershipServiceMock = {
  validate: jest.fn().mockResolvedValue(undefined),
};

const validateTransactionOwnershipServiceMock = {
  validate: jest.fn().mockResolvedValue(undefined),
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: transactionsRepositoryMock,
        },
        {
          provide: ValidateBankAccountOwnershipService,
          useValue: validateBankAccountOwnershipServiceMock,
        },
        {
          provide: ValidateCategoryOwnershipService,
          useValue: validateCategoryOwnershipServiceMock,
        },
        {
          provide: ValidateTransactionOwnershipService,
          useValue: validateTransactionOwnershipServiceMock,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should validate ownerships and create a transaction', async () => {
      const userId = 'user-1';
      const dto = {
        name: 'Coffee',
        value: 1200,
        type: 'EXPENSE',
        date: new Date('2025-10-28T00:00:00.000Z') as unknown as string,
        bankAccountId: 'bank-1',
        categoryId: 'cat-1',
      };

      const created = { id: 'trx-1', ...dto, userId } as any;
      transactionsRepositoryMock.create.mockResolvedValueOnce(created);

      const result = await service.create(userId, dto as any);

      expect(
        validateBankAccountOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, dto.bankAccountId);
      expect(
        validateCategoryOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, dto.categoryId);
      expect(transactionsRepositoryMock.create).toHaveBeenCalledWith({
        data: { ...dto, userId },
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAllByUserId', () => {
    it('should return user transactions', async () => {
      const userId = 'user-1';
      const list = [{ id: 't1' }, { id: 't2' }];
      transactionsRepositoryMock.findMany.mockResolvedValueOnce(list);

      const result = await service.findAllByUserId(userId, {
        month: 1,
        year: 2025,
      });

      expect(transactionsRepositoryMock.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          bankAccountId: undefined,
          date: {
            gte: new Date(Date.UTC(2025, 1)),
            lt: new Date(Date.UTC(2025, 2)),
          },
        },
      });
      expect(result).toBe(list);
    });
  });

  describe('update', () => {
    it('should validate ownerships and update transaction', async () => {
      const userId = 'user-1';
      const transactionId = 'trx-1';
      const dto = {
        name: 'Groceries',
        value: 5000,
        type: 'EXPENSE',
        date: new Date('2025-10-29T00:00:00.000Z') as unknown as string,
        bankAccountId: 'bank-1',
        categoryId: 'cat-1',
      };

      const updated = { id: transactionId, ...dto } as any;
      transactionsRepositoryMock.update.mockResolvedValueOnce(updated);

      const result = await service.update(userId, transactionId, dto as any);

      expect(
        validateTransactionOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, transactionId);
      expect(
        validateBankAccountOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, dto.bankAccountId);
      expect(
        validateCategoryOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, dto.categoryId);
      expect(transactionsRepositoryMock.update).toHaveBeenCalledWith({
        where: { id: transactionId },
        data: {
          bankAccountId: dto.bankAccountId,
          categoryId: dto.categoryId,
          name: dto.name,
          value: dto.value,
          type: dto.type,
          date: dto.date,
        },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should validate ownership and delete transaction', async () => {
      const userId = 'user-1';
      const transactionId = 'trx-1';
      const deleted = { id: transactionId } as any;
      transactionsRepositoryMock.delete.mockResolvedValueOnce(deleted);

      const result = await service.remove(userId, transactionId);

      expect(
        validateTransactionOwnershipServiceMock.validate,
      ).toHaveBeenCalledWith(userId, transactionId);
      // Bank and Category validations may be called with undefined based on current implementation
      expect(transactionsRepositoryMock.delete).toHaveBeenCalledWith({
        where: { id: transactionId },
      });
      expect(result).toBeNull();
    });
  });
});
