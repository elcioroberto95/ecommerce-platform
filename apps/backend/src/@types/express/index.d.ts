declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'CUSTOMER' | 'ADMIN';
      };

      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}
export {};