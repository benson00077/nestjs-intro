import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from './interfaces/jwt.interface';

// protecting endpoints by requiring a valid JWT 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const JWT_SECRET_KEY = 'SECRET' //TODO: env var
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: IPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
