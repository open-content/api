import { Injectable, HttpException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';

import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../user/user.service';

import { checkHash, nameFromSlug } from '../utils/helpers';
import { Workspace } from '../workspace/workspace.entity';

@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private jwt: JwtService,
    private workspace: WorkspaceService
  ) {}

  async validate(email: string, password: string, workspace: string): Promise<any> {
    const user = await this.user.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'avatar',
        'bio',
        'location',
        'createdAt',
        'updatedAt',
        'role',
        'status',
      ],
      relations: ['workspace']
    });
    
    if(!user) {
      return null;
    }

    if(user.workspace.slug !== workspace) {
      return null;
    }

    const isValid = await checkHash(password, user.password);

    if(isValid) {
      const { password, ...rest } = user;      
      return rest;
    }

    return null;
  }

  async login({email, password, workspace}: any, {ua, ip}: any): Promise<any> {

    const user: User = await this.validate(
      email,
      password,
      workspace
    );

    if(!user) {
      throw new HttpException('Unauthorised.', 401);
    }

    if (!user.status) {
      throw new HttpException('', 401);
    }

    const payload: any = {
      ua,
      ip,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        workspace: {
          id: user.workspace.id,
          name: user.workspace.name,
          slug: user.workspace.slug,
          avatar: user.workspace.avatar
        }
      }
    }
    
    return {
      token: this.jwt.sign(payload),
      user,
    };
  }

  async register(user: any): Promise<any> {

    let _user: User = await this.user.findOne({
      where: {
        email: user.email
      }
    });
    

    if(_user) {
      return {
        status: false,
        message: 'Email already exists.'
      }
    }

    let _workspace: Workspace = await this.workspace.findOne({
      slug: user.workspace
    });

    if(_workspace) {
      return {
        status: false,
        message: 'Workspace already exists.'
      }
    }

    const workspaceInput: any = {
      name: nameFromSlug(user.workspace),
      slug: user.workspace,
      status: true
    }

    _workspace = await this.workspace.create(workspaceInput);
    
    _user = await this.user.create({
      ...user,
      workspace: _workspace.id
    });

    return {
      ..._user,
      workspace: _workspace
    }
  }

  async checkWorkspace(slug: string) {
    return this.workspace.findOne({slug});
  }

  async checkEmail(email: string) {
    return this.user.findOne({
      where: { email },
      relations: ['workspace']
    });
  }

  async forgetWorkspaceUrl(email: string) {
    const user: User = await this.user.findOne({email});
  }

  async forgetPassword(email: string) {

  }

  async resetPassword(input: any) {

  }
}
