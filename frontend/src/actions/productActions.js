import axios from "axios";
import {
  productsFail,
  productsSuccess,
  productsRequest,
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,
} from "../slices/productsSlice";
import {
  productFail,
  productSuccess,
  productRequest,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFail,
} from "../slices/productSlice";
import toast from "react-hot-toast";


const API_URL=import.meta.env.VITE_API_URL;

export const getProducts =
  (searchItem, currentPage, price, category, ratings, sortingVal) =>
  async (dispatch) => {
    try {
      dispatch(productsRequest());
      let link = `${API_URL}/products`;

      if (currentPage) {
        link += `?page=${currentPage}`;
      }

      if (searchItem) {
        link += `&name=${searchItem}`;
      }

      if (price) {
        if (price.length > 0) {
          link += `&price=${price[0]},${price[1]}`;
        }
      }
      if (ratings) {
        link += `&ratings=${ratings}`;
      }
      if (category) {
        if (category.length > 0) {
          link += `&category=${category}`;
        }
      }
      if (sortingVal) {
        if (sortingVal == 1) {
          link += `&ordeyByPrice=desc`;
        } else if (sortingVal == 2) {
          link += `&ordeyByPrice=asc`;
        } else if (sortingVal == 3) {
          link += `&ordeyByName=asc`;
        } else if (sortingVal == 4) {
          link += `&ordeyByName=desc`;
        }
      }

      const { data } = await axios.get(link);
      console.log(link);
      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productsFail(error.response.data.message));
    }
  };

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(productsRequest());
    let link = `${API_URL}/products?limit=1000`;

    const { data } = await axios.get(link);

    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response.data.message));
  }
};

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(
      `${API_URL}/product/${id}`
    );
    dispatch(productSuccess(data));
  } catch (error) {
    dispatch(productFail(error.response.data.message));
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${API_URL}/review`,
      reviewData,
      config
    );
    dispatch(createReviewSuccess(data));
  } catch (error) {
    dispatch(createReviewFail(error.response.data.message));
  }
};

export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch(adminProductsRequest());
    const { data } = await axios.get(
      `${API_URL}/admin/products`,
      { withCredentials: true }
    );
    dispatch(adminProductsSuccess(data));
  } catch (error) {
    dispatch(adminProductsFail(error?.response?.data?.message));
  }
};

export const createNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${API_URL}/admin/product/new`,
      productData,
      config
    );
    dispatch(newProductSuccess(data));
  } catch (error) {
    dispatch(newProductFail(error?.response?.data?.message));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    const config = {
      withCredentials: true,
    };
    await axios.delete(
      `${API_URL}/admin/product/${id}`,
      config
    );
    dispatch(deleteProductSuccess());
  } catch (error) {
    dispatch(deleteProductFail(error?.response?.data?.message));
  }
};

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${API_URL}/admin/product/${id}`,
      productData,
      config
    );
    dispatch(updateProductSuccess(data));
  } catch (error) {
    dispatch(updateProductFail(error?.response?.data?.message));
  }
};

export const getReviews = (id) => async (dispatch) => {
  try {
    dispatch(reviewsRequest());

    const { data } = await axios.get(
      `${API_URL}/admin/reviews`,
      {
        params: { id }, 
        withCredentials: true, 
      }
    );

    dispatch(reviewsSuccess(data));

    if(data.reviews.length ==0){
      toast.error("No Reviews Found This Product Id")
    }

  } catch (error) {
    dispatch(reviewsFail(error.response?.data?.message || error.message));
  }
};

export const deleteReview = (productId, id) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());
    let link = `${API_URL}/admin/review`;

    await axios.delete(link, {
      params: { productId, id },
      withCredentials: true,
    });

    dispatch(deleteReviewSuccess());
  } catch (error) {
    dispatch(deleteReviewFail(error.response?.data?.message || error.message));
  }
};
