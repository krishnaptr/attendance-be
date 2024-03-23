import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { respond500, respondForbidden } from 'src/helper/response';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/module/user/user.service';
const config = process.env;
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly sUser: UserService
  ) {

  }
  dashboardPermission = {
    user: [''],
    all: [''],
  };
  async use(req: Request, res: Response, next: NextFunction) {
    // If there is no authorization method.
    if (!req.headers['authorization']) {
      respondForbidden(res);
      return;
    }

    // Check if the token format is valid.
    let bearer = req.headers['authorization'];
    let token = null;
    if (bearer) {
      token = bearer.slice(7);
    }
    if (!token) {
      respondForbidden(res);
      return;
    }

    try {
     
      // Decoding JWT token
      const decoded: any = jwt.verify(token, config.SALT);
      const hasUsername = !!decoded && !!decoded.username;
      const hasId = !!decoded && !!decoded.id;
      const hasIat = !!decoded && !!decoded.iat;
      if (!hasUsername || !hasId || !hasIat) {
        respondForbidden(res);
        return;
      }

      // Get first route of url
      const origin = req['originalUrl'].split('/')[1].split('?')[0];

      let isValidUser: boolean;
      isValidUser = await this.validateUser(
        req,
        res,
        next,
        decoded,
        origin,
        token,
      );

      if (!isValidUser) {
        return;
      }

      // Pass all data to controller
      res.locals.token = token;
      res.locals.tokenData = decoded;
      next();
    } catch (err) {
      console.error(err);
      respond500(res);
      return;
    }
  }

  async validateUser(
    req: Request,
    res: Response,
    next: NextFunction,
    decoded: any,
    origin: string,
    token: string,
  ) {
    try {
      // Check if the user accessing sensitive area
      if (this.dashboardPermission.all.includes(origin)) {
        respondForbidden(res);
        return;
      }

      // Validate in the database
      const isValidAuth = await this.sUser.isValidAuth(
        token,
        decoded.id,
        decoded.username,
      );
      if (!isValidAuth) {
        respondForbidden(res);
        return;
      }

      return true;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
