/**
 * Express type augmentation for Unified Health Platform
 *
 * This module declaration extends Express types to ensure
 * req.params values are always strings (not string | string[]).
 */

import { ParamsDictionary } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: string;
  }
}

declare module 'express' {
  interface Request {
    params: {
      [key: string]: string;
    };
  }
}

export {};
