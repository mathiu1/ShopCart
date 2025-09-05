import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addCartItem = (id, quantity) => async (dispatch) => {
  try {
    dispatch(addCartItemRequest());
    const { data } = await axios.get(
      `${API_URL}/product/${id}`
    );
    
    dispatch(
      addCartItemSuccess({
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].image,
        stock: data.product.stock,
        quantity,
      })
    );
  } catch (error) {}
};
