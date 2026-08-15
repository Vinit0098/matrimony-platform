import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [InterestsService, PrismaService],
  controllers: [InterestsController]
})
export class InterestsModule {}