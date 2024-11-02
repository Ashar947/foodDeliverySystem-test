import * as jwt from 'jsonwebtoken';

type CheckTokenIsValidOrExpired = {
  success: boolean;
  message?: string;
  expired?: boolean;
  data?: string | jwt.JwtPayload;
};
// type pass or emailverify
export const checkTokenIsValidOrExpired = async ({
  token,
  secret,
}): Promise<CheckTokenIsValidOrExpired> => {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded) return { success: false, message: 'Token is Invalid' };
    return { success: true, data: decoded };
  } catch (error) {
    const expired = error.name === 'TokenExpiredError';
    return {
      success: false,
      expired,
      message: expired ? 'Your Token is Expired!' : 'Token is Invalid',
    };
  }
};
