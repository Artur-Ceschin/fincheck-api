import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const emailTaken = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (emailTaken) {
      throw new ConflictException('Email already taken');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              {
                name: 'Salary',
                icon: 'travel',
                type: 'INCOME',
                color: '#00AA63',
              },
              {
                name: 'Freelance',
                icon: 'freelance',
                type: 'INCOME',
                color: '#0084F4',
              },
              {
                name: 'Other',
                icon: 'other',
                type: 'INCOME',
                color: '#6B7280',
              },
              {
                name: 'Home',
                icon: 'home',
                type: 'EXPENSE',
                color: '#F97316',
              },
              {
                name: 'Food',
                icon: 'food',
                type: 'EXPENSE',
                color: '#EF4444',
              },
              {
                name: 'Education',
                icon: 'education',
                type: 'EXPENSE',
                color: '#8B5CF6',
              },
              {
                name: 'Leisure',
                icon: 'fun',
                type: 'EXPENSE',
                color: '#EC4899',
              },
              {
                name: 'Grocery',
                icon: 'grocery',
                type: 'EXPENSE',
                color: '#10B981',
              },
              {
                name: 'Clothes',
                icon: 'clothes',
                type: 'EXPENSE',
                color: '#06B6D4',
              },
              {
                name: 'Transport',
                icon: 'transport',
                type: 'EXPENSE',
                color: '#F59E0B',
              },
              {
                name: 'Travel',
                icon: 'travel',
                type: 'EXPENSE',
                color: '#3B82F6',
              },
              {
                name: 'Other',
                icon: 'other',
                type: 'EXPENSE',
                color: '#6B7280',
              },
            ],
          },
        },
      },
    });

    return user;
  }
}
