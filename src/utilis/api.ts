import api from "./axios";
import axios from "axios";

// categories
export const categoriesAPi = {
  getCategories: () => api.get("/categories"),
};

//UserInfo
export const userInfoAPi = {
  getUserInfoAPis: () => api.get("/user"),
};
// products
export const productsAPi = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductDetials: (id: string) => api.get(`/products/${id}`),
};
// checkout
export const checkoutAPi = {
  checkout: (params = {}, data: any) => api.post("/checkout", data),
};
// checkout
export const ordersApi = {
  getOrders: () => api.get("/orders/client"),
};

// token
export const refreshAccessToken = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.access_token;
};
