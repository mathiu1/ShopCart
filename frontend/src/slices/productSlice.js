import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: true,
    uploadLoading: false,
    isReviewSubmitted: false,
    isProductCreated: false,
    isProductDeleted: false,
    isProductUpdate: false,
    isReviewDeleted: false,
    reviews: [],
    product: {},
    relatedProducts: [],
  },
  reducers: {
    productRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    productSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        relatedProducts: action.payload.relatedProducts,
      };
    },
    productFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    createReviewRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createReviewSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isReviewSubmitted: true,
      };
    },
    createReviewFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    createReviewSubmitted(state, action) {
      return {
        ...state,
        isReviewSubmitted: false,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    newProductRequest(state, action) {
      return {
        ...state,
        loading: true,
        uploadLoading: true,
      };
    },
    newProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductCreated: true,
        uploadLoading: false,
      };
    },
    newProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isProductCreated: false,
        uploadLoading: false,
      };
    },
    clearProductCreated(state, action) {
      return {
        ...state,
        isProductCreated: false,
      };
    },
    deleteProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isProductDeleted: true,
      };
    },
    deleteProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearProductDeleted(state, action) {
      return {
        ...state,
        isProductDeleted: false,
      };
    },
    updateProductRequest(state, action) {
      return {
        ...state,
        loading: true,
        uploadLoading: true,
      };
    },
    updateProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductUpdate: true,
        uploadLoading: false,
      };
    },
    updateProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isProductUpdate: false,
        uploadLoading: false,
      };
    },
    clearProductUpdated(state, action) {
      return {
        ...state,
        isProductUpdate: false,
      };
    },
    reviewsRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    reviewsSuccess(state, action) {
      return {
        ...state,
        loading: false,
        reviews: action.payload.reviews,
       
      };
    },
     clearReviews(state, action) {
      return {
        ...state,
        loading: false,
        reviews: [],
       
      };
    },
    reviewsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },deleteReviewRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteReviewSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isReviewDeleted: true,
      };
    },
    deleteReviewFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearReviewsDeleted(state, action) {
      return {
        ...state,
        isReviewDeleted: false,
      };
    },
  },
});

const { actions, reducer } = productSlice;

export const {
  productRequest,
  productSuccess,
  productFail,
  clearError,
  createReviewFail,
  createReviewSuccess,
  createReviewRequest,
  createReviewSubmitted,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  clearProductCreated,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  clearProductDeleted,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  clearProductUpdated,
  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  clearReviewsDeleted,
  deleteReviewRequest,
  deleteReviewSuccess,deleteReviewFail,
  clearReviews
} = actions;

export default reducer;
