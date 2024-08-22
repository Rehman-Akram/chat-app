import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERRORS, JWT_SECRET } from '../../shared/constants/constants';
import { NotFoundError, UnauthroizedError } from '../../shared/errors';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schemas/user.schema';
import { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: (req) => {
        // Check cookies for the bearer token first
        const tokenFromCookies = req.cookies && req.cookies.token;
        if (tokenFromCookies) {
          return tokenFromCookies;
        }
        // If not found in cookies, extract from the Authorization header
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    try {
      const { _id } = payload;
      if (!_id) {
        throw new UnauthroizedError(ERRORS.INVALID_TOKEN);
      }
      const user = await this.userService.findOneById(_id);
      if (!user) {
        throw new NotFoundError(ERRORS.INVALID_TOKEN);
      }
      return user;
    } catch (error) {
      Logger.error(
        `Error in validate of jwt strategy where payload: ${JSON.stringify(payload)}`,
      );
      throw error;
    }
  }
}
