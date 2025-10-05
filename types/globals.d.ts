/// <reference types="@clerk/express/env" />

import { Request } from 'express';
import { AuthObject } from '@clerk/express';

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject;
    }
  }
}
