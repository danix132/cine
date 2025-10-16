import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('🔍 JWT Guard Debug:', {
      hasAuthHeader: !!authHeader,
      authHeaderStart: authHeader?.substring(0, 20) + '...' || 'No header',
      hasUser: !!user,
      error: err?.message,
      info: info?.message,
      url: request.url,
      method: request.method
    });
    
    if (err || !user) {
      console.log('❌ JWT Guard - Unauthorized:', {
        error: err?.message,
        info: info?.message,
        hasAuthHeader: !!authHeader
      });
      throw err || new UnauthorizedException('Token inválido o expirado');
    }
    
    console.log('✅ JWT Guard - Usuario autenticado:', {
      userId: user.id,
      userEmail: user.email,
      userRole: user.rol
    });
    
    return user;
  }
} 
