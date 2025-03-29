import { useState } from 'react';
import { addNewInventoryRequest, updateInventoryRequest, deleteInventoryRequest, getAllInventoryRequest, getInventoryRequest } from "../api/inventoryService";
import handleRequest from '@/lib/handleRequest';

const useInventory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addNewInventory = (body) => handleRequest(addNewInventoryRequest,true,true, body);
  const updateInventory = () => handleRequest(updateInventoryRequest,true,true);
  const deleteInventory = () => handleRequest(deleteInventoryRequest,true,true);
  const getAllInventory = () => handleRequest(getAllInventoryRequest,true,true);
  const getInventory = () => handleRequest(getInventoryRequest,true,true);

  return {
    isLoading,
    addNewInventory,
    updateInventory,
    deleteInventory,
    getAllInventory,
    getInventory
  };
};

export default useInventory;