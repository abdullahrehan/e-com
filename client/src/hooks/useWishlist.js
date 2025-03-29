import { useState } from 'react';
import { createWishlistRequest, updateWishlistRequest, deleteWishlistRequest, getWishlistRequest, addProductWishlistRequest, removeProductWishlistRequest } from "../api/wishlistService";
import handleRequest from '@/lib/handleRequest';

const useWishlist = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createWishlist = (body) => handleRequest(createWishlistRequest,true,true, body);
  const updateWishlist = () => handleRequest(updateWishlistRequest,true,true);
  const deleteWishlist = () => handleRequest(deleteWishlistRequest,true,true);
  const getWishlist = () => handleRequest(getWishlistRequest,true,true);
  const addProductWishlist = () => handleRequest(addProductWishlistRequest,true,true);
  const removeProductWishlist = () => handleRequest(removeProductWishlistRequest,true,true);

  return {
    isLoading,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    getWishlist,
    addProductWishlist,
    removeProductWishlist
  };
};

export default useWishlist;