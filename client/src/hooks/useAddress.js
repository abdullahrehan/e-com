import { useState } from 'react';
import { createNewAddressRequest, updateAddressRequest, deleteAddressRequest, getAllAddressesRequest, getAddressesByIdRequest } from "../api/addressService";
import handleRequest from '@/lib/handleRequest';

const useAddress = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewAddress = (body) => handleRequest(createNewAddressRequest,true,true, body);
  const updateAddress = (params) => handleRequest(updateAddressRequest,true,true, params);
  const deleteAddress = (params) => handleRequest(deleteAddressRequest,true,true, params);
  const getAllAddresses = () => handleRequest(getAllAddressesRequest,true,true);
  const getAddressesById = (params) => handleRequest(getAddressesByIdRequest,true,true, params);

  return {
    isLoading,
    createNewAddress,
    updateAddress,
    deleteAddress,
    getAllAddresses,
    getAddressesById
  };
};

export default useAddress;