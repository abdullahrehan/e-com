import { useState } from 'react';
import { createNewComplaintRequest, updateComplaintRequest, deleteComplaintRequest, getAllComplaintsRequest, getComplaintRequest } from "../api/complaintService";
import handleRequest from '@/lib/handleRequest';

const useComplaint = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewComplaint = (body) => handleRequest(createNewComplaintRequest,true,true, body);
  const updateComplaint = () => handleRequest(updateComplaintRequest,true,true);
  const deleteComplaint = () => handleRequest(deleteComplaintRequest,true,true);
  const getAllComplaints = () => handleRequest(getAllComplaintsRequest,true,true);
  const getComplaint = () => handleRequest(getComplaintRequest,true,true);

  return {
    isLoading,
    createNewComplaint,
    updateComplaint,
    deleteComplaint,
    getAllComplaints,
    getComplaint
  };
};

export default useComplaint;