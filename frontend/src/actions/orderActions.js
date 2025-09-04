import { adminOrderFail, adminOrderRequest, adminOrderSuccess, createOrderFail, createOrderRequest, createOrderSuccess, deleteOrderFail, deleteOrderRequest, deleteOrderSuccess, OrderDetailFail, OrderDetailRequest, OrderDetailSuccess, updateOrderFail, updateOrderRequest, updateOrderSuccess, userOrderFail, userOrderRequest, userOrderSuccess } from "../slices/orderSlice"
import axios from "axios";

export const createOrder = order => async(dispatch)=>{
    try {
        dispatch(createOrderRequest())
      const {data}=  await axios.post(`http://127.0.0.1:8000/api/v1/order/new`,order,{withCredentials:true})
      dispatch(createOrderSuccess(data))
       return data; 

    } catch (error) {
        dispatch(createOrderFail(error?.response?.data?.message))
    }
}

export const userOrders =  async(dispatch)=>{
    try {
        dispatch(userOrderRequest())
      const {data}=  await axios.get(`http://127.0.0.1:8000/api/v1/myorders`,{withCredentials:true})
     
      dispatch(userOrderSuccess(data))

    } catch (error) {
        dispatch(userOrderFail(error?.response?.data?.message))
    }
}

export const orderDetail = id => async(dispatch)=>{
    try {
        dispatch(OrderDetailRequest())
      const {data}=  await axios.get(`http://127.0.0.1:8000/api/v1/order/${id}`,{withCredentials:true})
      
      dispatch(OrderDetailSuccess(data))

    } catch (error) {
        dispatch(OrderDetailFail(error?.response?.data?.message))
    }
}

export const adminOrders = ()=> async(dispatch)=>{
    try {
        dispatch(adminOrderRequest())
      const {data}=  await axios.get(`http://127.0.0.1:8000/api/v1/admin/orders`,{withCredentials:true})
     
      dispatch(adminOrderSuccess(data))

    } catch (error) {
        dispatch(adminOrderFail(error?.response?.data?.message))
    }
}

export const deleteOrders = id => async(dispatch)=>{
    try {
        dispatch(deleteOrderRequest())
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/order/${id}`,{withCredentials:true})
     
      dispatch(deleteOrderSuccess())

    } catch (error) {
        dispatch(deleteOrderFail(error?.response?.data?.message))
    }
}

export const updateOrders = (id,orderData) => async(dispatch)=>{
    try {
        dispatch(updateOrderRequest())
     const {data}=  await axios.put(`http://127.0.0.1:8000/api/v1/admin/order/${id}`,orderData,{withCredentials:true})
     
      dispatch(updateOrderSuccess(data))

    } catch (error) {
        dispatch(updateOrderFail(error?.response?.data?.message))
    }
}


