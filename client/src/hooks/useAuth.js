import { useState } from 'react';
import { signupRequest, signupAdminRequest, verifyEmailRequest, loginRequest, forgotPasswordRequest, verifyResetPasswordRequest
  , resetPasswordRequest 
} from "../api/authService";
import handleRequest from '@/lib/handleRequest';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signup = (body) => handleRequest(signupRequest,true,true, body);
  const signupAdmin = (body) => handleRequest(signupAdminRequest,true,true, body);
  const verifyEmail = (body) => handleRequest(verifyEmailRequest,true,true, body);
  const login = (body) => handleRequest(loginRequest,true,true, body);
  const forgotPassword = (body) => handleRequest(forgotPasswordRequest,true,true, body);
  const verifyResetPassword = (body) => handleRequest(verifyResetPasswordRequest,true,true, body);
  const resetPassword = (body) => handleRequest(resetPasswordRequest,true,true,body);

  return {
    isLoading,
    signup,
    signupAdmin,
    verifyEmail,
    login,
    forgotPassword,
    verifyResetPassword,
    resetPassword
  };
};

export default useAuth;