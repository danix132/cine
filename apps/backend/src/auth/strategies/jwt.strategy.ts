import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('🔍 JWT Strategy - Validando payload:', {
      sub: payload.sub,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
      currentTime: Math.floor(Date.now() / 1000)
    });
    
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      console.log('❌ JWT Strategy - Usuario no encontrado:', payload.sub);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    console.log('✅ JWT Strategy - Usuario validado:', {
      id: user.id,
      email: user.email,
      rol: user.rol
    });

    return user;
  }
}
