import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async sendInterest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException("You cannot send an interest to yourself");
    }

    const existing = await this.prisma.interest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } }
    });

    if (existing) {
      throw new BadRequestException("Interest already sent");
    }

    return this.prisma.interest.create({
      data: { senderId, receiverId }
    });
  }

  async getReceivedInterests(userId: string) {
    return this.prisma.interest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: { include: { profile: true } }
      }
    });
  }

  async updateStatus(interestId: string, status: string) {
    return this.prisma.interest.update({
      where: { id: interestId },
      data: { status }
    });
  }

  async getMatches(userId: string) {
    const matches = await this.prisma.interest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    });

    const formattedMatches = matches.map(match => {
      const isSender = match.senderId === userId;
      const matchedUser = isSender ? match.receiver : match.sender;
      
      return {
        matchId: match.id,
        matchedAt: match.createdAt,
        user: matchedUser 
      };
    });

    // Filter out duplicate users so they only show up once
    const uniqueMatches = Array.from(
      new Map(formattedMatches.map(m => [m.user.id, m])).values()
    );

    return uniqueMatches;
  }
}