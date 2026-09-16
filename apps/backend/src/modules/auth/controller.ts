import type { RequestHandler } from 'express';

import { authService } from './service';
import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from './schemas';

const login: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as LoginInput;

    const result = await authService.login(data);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const forgotPassword: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as ForgotPasswordInput;

    await authService.requestPasswordReset(data);

    // 202: the request was accepted. Whether an email exists is not disclosed.
    response.status(202).json({
      message: 'If that email is registered, a reset link has been sent',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as ResetPasswordInput;

    await authService.resetPassword(data);

    response.status(200).json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
  forgotPassword,
  resetPassword,
};