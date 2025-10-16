import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { env } from './shared/config/env';
import { AuthGuard } from './modules/auth/auth.guard';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: env.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
