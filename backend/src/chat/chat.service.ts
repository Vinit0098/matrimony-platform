import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  async getConversation(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' }, 
    });
  }

  async addReaction(messageId: string, reaction: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { reaction },
    });
  }

  // --- NEW: Mark unread messages as read ---
  async markMessagesAsRead(senderId: string, receiverId: string) {
    // We update all messages sent BY the other person TO us that are currently unread
    return this.prisma.message.updateMany({
      where: { 
        senderId: senderId, 
        receiverId: receiverId, 
        isRead: false 
      },
      data: { isRead: true },
    });
  }


  // --- NEW: Count unread messages for the notification badge ---
  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: { 
        receiverId: userId, 
        isRead: false 
      }
    });
    return { unreadCount: count };
  }
  
}