import { useState } from 'react';
import { createPromoCodeRequest, verifyPromoCodeRequest, updatePromoCodeRequest, deletePromoCodeRequest, getPromoCodeRequest, getAllPromoCodesRequest } from "../api/promoService";
import handleRequest from '@/lib/handleRequest';

const usePromo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPromoCode = (body) => handleRequest(createPromoCodeRequest,true,true, body);
  const verifyPromoCode = (body) => handleRequest(verifyPromoCodeRequest,true,true, body);
  const updatePromoCode = () => handleRequest(updatePromoCodeRequest,true,true);
  const deletePromoCode = () => handleRequest(deletePromoCodeRequest,true,true);
  const getPromoCode = () => handleRequest(getPromoCodeRequest,true,true);
  const getAllPromoCodes = () => handleRequest(getAllPromoCodesRequest,true,true);

  return {
    isLoading,
    createPromoCode,
    verifyPromoCode,
    updatePromoCode,
    deletePromoCode,
    getPromoCode,
    getAllPromoCodes
  };
};

export default usePromo;