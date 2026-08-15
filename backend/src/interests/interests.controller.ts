import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InterestsService } from './interests.service';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  sendInterest(@Body() body: { senderId: string, receiverId: string }) {
    return this.interestsService.sendInterest(body.senderId, body.receiverId);
  }

  @Get('received/:userId')
  getReceivedInterests(@Param('userId') userId: string) {
    return this.interestsService.getReceivedInterests(userId);
  }

  // --- NEW: Route to get successful matches ---
  @Get('matches/:userId')
  getMatches(@Param('userId') userId: string) {
    return this.interestsService.getMatches(userId);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.interestsService.updateStatus(id, status);
  }
}