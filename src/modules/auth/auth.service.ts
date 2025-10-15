import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup-dto';
import { SignInDto } from './dto/singin-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken,
    };
  }

  async signup(createUserDto: SignUpDto) {
    const { name, email, password } = createUserDto;
    const emailTaken = await this.usersRepository.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });

    if (emailTaken) {
      throw new ConflictException('Email already taken');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepository.create({
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

    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken,
    };
  }

  private async generateAccessToken(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }
}
