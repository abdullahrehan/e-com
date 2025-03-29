import { useState } from 'react';
import { updateUserRequest, uploadImageRequest, newRequestRequest } from "../api/usersService";
import handleRequest from '@/lib/handleRequest';

const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = (params) => handleRequest(updateUserRequest,true,true, params);
  const uploadImage = () => handleRequest(uploadImageRequest,true,true);
  const newRequest = () => handleRequest(newRequestRequest,true,true);

  return {
    isLoading,
    updateUser,
    uploadImage,
    newRequest
  };
};

export default useUsers;