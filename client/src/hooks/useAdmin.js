import { useState } from 'react';
import { getAllUsersRequest, addCategoryRequest, deleteAllUsersRequest, deleteUserRequest } from "../api/adminService";
import handleRequest from '@/lib/handleRequest';

const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = () => handleRequest(getAllUsersRequest,true,true);
  const addCategory = (body) => handleRequest(addCategoryRequest,true,true, body);
  const deleteAllUsers = () => handleRequest(deleteAllUsersRequest,true,true);
  const deleteUser = () => handleRequest(deleteUserRequest,true,true);

  return {
    isLoading,
    getAllUsers,
    addCategory,
    deleteAllUsers,
    deleteUser
  };
};

export default useAdmin;