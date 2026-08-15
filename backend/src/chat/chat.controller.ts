import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // --- NEW: Endpoint to fetch the unread count ---
  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.chatService.getUnreadCount(userId);
  }

  @Get(':userId1/:userId2')
  getConversation(@Param('userId1') userId1: string, @Param('userId2') userId2: string) {
    return this.chatService.getConversation(userId1, userId2);
  }
}