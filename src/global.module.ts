import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { Logger } from './logger.service';

@Global()
@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {      
      return {
        secretOrKeyProvider(type: JwtSecretRequestType) {
          switch(type) {
            case JwtSecretRequestType.SIGN:
              return readFileSync(config.get('JWT_PRIVATE_KEY'), 'utf8');

            case JwtSecretRequestType.VERIFY:
              return readFileSync(config.get('JWT_PUBLIC_KEY'), 'utf8')
          }
        },
        signOptions: {
          expiresIn: config.get('JWT_EXPIRY'),
          issuer: config.get('JWT_ISSUER'),
          algorithm: config.get('JWT_ALGORITHM')
        }
      }
    },
    inject: [ConfigService]
  })],
  providers: [Logger],
  exports: [JwtModule, Logger]
})
export class GlobalModule{}