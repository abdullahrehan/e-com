import { useState } from 'react';
import { createNewOrderRequest, updateOrderRequest, deleteOrderRequest, getAllOrdersRequest, getOrderRequest } from "../api/ordersService";
import handleRequest from '@/lib/handleRequest';

const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewOrder = (body) => handleRequest(createNewOrderRequest,true,true, body);
  const updateOrder = () => handleRequest(updateOrderRequest,true,true);
  const deleteOrder = () => handleRequest(deleteOrderRequest,true,true);
  const getAllOrders = () => handleRequest(getAllOrdersRequest,true,true);
  const getOrder = () => handleRequest(getOrderRequest,true,true);

  return {
    isLoading,
    createNewOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrder
  };
};

export default useOrders;