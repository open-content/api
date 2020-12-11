import {
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Equal, Not } from 'typeorm';

import { JwtGuard } from '../jwt.guard';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspace: WorkspaceService) {}
}