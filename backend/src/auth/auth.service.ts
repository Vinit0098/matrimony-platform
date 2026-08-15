import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    // 1. Find the user by their email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Check the password (handles both bcrypt hashes and plain text for our older test users)
    const isMatch = await bcrypt.compare(pass, user.passwordHash).catch(() => false) || pass === user.passwordHash;

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Create the secure token payload
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    // 4. Return the encrypted JWT token to the frontend
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id
    };
  }
}