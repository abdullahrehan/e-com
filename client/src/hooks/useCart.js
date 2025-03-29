import { useState } from 'react';
import { addCartItemRequest, updateCartRequest, getCartRequest, clearCartRequest, deleteCartItemRequest } from "../api/cartService";
import handleRequest from '@/lib/handleRequest';

const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addCartItem = (body) => handleRequest(addCartItemRequest,true,true, body);
  const updateCart = () => handleRequest(updateCartRequest,true,true);
  const getCart = () => handleRequest(getCartRequest,true,true);
  const clearCart = () => handleRequest(clearCartRequest,true,true);
  const deleteCartItem = () => handleRequest(deleteCartItemRequest,true,true);

  return {
    isLoading,
    addCartItem,
    updateCart,
    getCart,
    clearCart,
    deleteCartItem
  };
};

export default useCart;