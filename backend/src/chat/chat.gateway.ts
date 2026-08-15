import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server; // <-- Added the exclamation mark (!) here

  private userSockets = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleDisconnect(client: Socket) {
    this.userSockets.forEach((value, key) => {
      if (value === client.id) this.userSockets.delete(key);
    });
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    this.userSockets.set(userId, client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: { senderId: string, receiverId: string, content: string }, @ConnectedSocket() client: Socket) {
    const savedMessage = await this.chatService.saveMessage(payload.senderId, payload.receiverId, payload.content);
    const receiverSocketId = this.userSockets.get(payload.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', savedMessage);
    }
    client.emit('newMessage', savedMessage);
  }

  @SubscribeMessage('addReaction')
  async handleReaction(@MessageBody() payload: { messageId: string, reaction: string, receiverId: string }, @ConnectedSocket() client: Socket) {
    const updatedMessage = await this.chatService.addReaction(payload.messageId, payload.reaction);
    const receiverSocketId = this.userSockets.get(payload.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('messageReacted', updatedMessage);
    }
    client.emit('messageReacted', updatedMessage);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() payload: { senderId: string, receiverId: string }, @ConnectedSocket() client: Socket) {
    await this.chatService.markMessagesAsRead(payload.senderId, payload.receiverId);

    const senderSocketId = this.userSockets.get(payload.senderId);
    
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messagesRead', { 
        readerId: payload.receiverId 
      });
    }
  }
}