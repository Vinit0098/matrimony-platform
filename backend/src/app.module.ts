import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { InterestsModule } from './interests/interests.module';
import { ChatModule } from './chat/chat.module'; // <-- Import the Chat module

@Module({
  imports: [UsersModule, ProfilesModule, AuthModule, InterestsModule, ChatModule], // <-- Add it here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}