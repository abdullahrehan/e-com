import { useState } from 'react';
import { addReviewRequest, updateReviewRequest, deleteReviewRequest, getAllReviewsRequest, getReviewRequest } from "../api/reviewService";
import handleRequest from '@/lib/handleRequest';

const useReview = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addReview = (body) => handleRequest(addReviewRequest,true,true, body);
  const updateReview = () => handleRequest(updateReviewRequest,true,true);
  const deleteReview = () => handleRequest(deleteReviewRequest,true,true);
  const getAllReviews = () => handleRequest(getAllReviewsRequest,true,true);
  const getReview = () => handleRequest(getReviewRequest,true,true);

  return {
    isLoading,
    addReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getReview
  };
};

export default useReview;