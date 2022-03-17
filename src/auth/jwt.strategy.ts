import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { IPayload } from './interfaces/jwt.interface';

// protecting endpoints by requiring a valid JWT 
// docs: https://docs.nestjs.com/security/authentication#implementing-passport-jwt

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJWTSecretKey(),
    });
  }

  async validate(payload: IPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
