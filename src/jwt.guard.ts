import { ExtractJwt } from 'passport-jwt';
import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate{
  constructor(@Inject('JwtService') private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();

    const req: Request = ctx.getRequest(),
      res: Response = ctx.getResponse();
      
    const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if(!token) {
      throw new HttpException('Unauthorized.', 403);
    }

    const {user, ua, ip}: any = this.jwt.verify(token);

    if(!user) {
      throw new HttpException('Unauthorized.', 403);
    }

    req.user = user;

    const newToken: string = this.jwt.sign({user, ua, ip})

    // res.cookie('Authorization', `Bearer ${newToken}`)
    res.header('Authorization', newToken);

    return true;
  }
}