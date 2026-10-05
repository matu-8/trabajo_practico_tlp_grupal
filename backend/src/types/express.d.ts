import type { TokenUserData } from '../repositories/interfaces/user.interface.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserData;
    }
  }
}

export {};