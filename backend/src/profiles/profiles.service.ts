import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: any) {
    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        dateOfBirth: new Date(createProfileDto.dateOfBirth), 
      },
    });
  }

  // This is the exact line that fixes the error!
  async findAll(query: any = {}) {
    return this.prisma.profile.findMany({
      where: query, 
      include: { user: true }, 
    });
  }

  findOne(id: string) {
    return this.prisma.profile.findUnique({ 
      where: { id },
      include: { user: true },
    });
  }

  update(id: string, updateProfileDto: any) {
    return `This action updates a #${id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }
}