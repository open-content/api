import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private auth: AuthService){}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response): Promise<any> {
    const info: any = await this.auth.login(req.body, {
      ua: req.headers['user-agent'],
      ip: req.connection.remoteAddress
    });

    // res.cookie('Authorization', `Bearer ${info.token}`);
    res.header('Authorization', info.token);

    return res.json(info.user);
  }

  @Post('/register')
  async register(@Req() req: Request): Promise<any> {
    return this.auth.register(req.body);
  }

  @Post('/email')
  async email(@Req() req: Request): Promise<any> {
    return this.auth.checkEmail(req.body.email);
  }

  @Post('/workspace')
  async workspace(@Req() req: Request) {
    return this.auth.checkWorkspace(req.body.workspace);
  }
}