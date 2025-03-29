import { useState } from 'react';
import { createNewCategoryRequest, updateCategoryRequest, deleteCategoryRequest, getAllCategoryRequest } from "../api/categoryService";
import handleRequest from '@/lib/handleRequest';

const useCategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewCategory = (body) => handleRequest(createNewCategoryRequest,true,true, body);
  const updateCategory = () => handleRequest(updateCategoryRequest,true,true);
  const deleteCategory = () => handleRequest(deleteCategoryRequest,true,true);
  const getAllCategory = () => handleRequest(getAllCategoryRequest,true,true);

  return {
    isLoading,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getAllCategory
  };
};

export default useCategory;