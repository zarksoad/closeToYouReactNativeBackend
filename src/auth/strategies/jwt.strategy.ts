import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload) {
      console.log('Invalid token - no payload found');
      throw new UnauthorizedException('Invalid token');
    }

    // Check if the token has expired
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (payload.exp < now) {
      console.log(`Token has expired: ${payload.exp}`);
      throw new UnauthorizedException('Token has expired');
    }

    console.log(`Token validated successfully for user: ${payload.userId}`);

    return { userId: payload.userId };
  }
}
