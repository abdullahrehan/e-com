import { useState } from 'react';
import { createNewPaymentMethodeRequest, updatePaymentMethodeRequest, deletePaymentMethodeRequest, getAllPaymentMethodsRequest, getPaymentMethodRequest, processPaymentRequest, getAllPaymentsRequest, getPaymentRequest, adminPaymentRequest, refundRequest, webhooksPaymentRequest } from "../api/paymentMethodeService";
import handleRequest from '@/lib/handleRequest';

const usePaymentMethode = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewPaymentMethode = (body) => handleRequest(createNewPaymentMethodeRequest,true,true, body);
  const updatePaymentMethode = () => handleRequest(updatePaymentMethodeRequest,true,true);
  const deletePaymentMethode = () => handleRequest(deletePaymentMethodeRequest,true,true);
  const getAllPaymentMethods = (params) => handleRequest(getAllPaymentMethodsRequest,true,true, params);
  const getPaymentMethod = () => handleRequest(getPaymentMethodRequest,true,true);
  const processPayment = (body) => handleRequest(processPaymentRequest,true,true, body);
  const getAllPayments = () => handleRequest(getAllPaymentsRequest,true,true);
  const getPayment = () => handleRequest(getPaymentRequest,true,true);
  const adminPayment = () => handleRequest(adminPaymentRequest,true,true);
  const refund = () => handleRequest(refundRequest,true,true);
  const webhooksPayment = () => handleRequest(webhooksPaymentRequest,true,true);

  return {
    isLoading,
    createNewPaymentMethode,
    updatePaymentMethode,
    deletePaymentMethode,
    getAllPaymentMethods,
    getPaymentMethod,
    processPayment,
    getAllPayments,
    getPayment,
    adminPayment,
    refund,
    webhooksPayment
  };
};

export default usePaymentMethode;