import { useState } from 'react';
import { createProductRequest, updateProductRequest, deleteProductRequest, deleteProductImageRequest, getAllProductsRequest, getProductByIdRequest } from "../api/productsService";
import handleRequest from '@/lib/handleRequest';

const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createProduct = () => handleRequest(createProductRequest,true,true);
  const updateProduct = () => handleRequest(updateProductRequest,true,true);
  const deleteProduct = () => handleRequest(deleteProductRequest,true,true);
  const deleteProductImage = () => handleRequest(deleteProductImageRequest,true,true);
  const getAllProducts = () => handleRequest(getAllProductsRequest,true,true);
  const getProductById = () => handleRequest(getProductByIdRequest,true,true);

  return {
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    getAllProducts,
    getProductById
  };
};

export default useProducts;