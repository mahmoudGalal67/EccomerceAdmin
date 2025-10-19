import { configureStore } from "@reduxjs/toolkit";
import { categorySlice } from "../services/categorySlice";
import { ColorSlice } from "../services/ColorSlice";
import { SizeSlice } from "../services/SizeSlice";
import { ProductSlice } from "../services/ProductSlice";

export const store = configureStore({
  reducer: {
    [ProductSlice.reducerPath]: ProductSlice.reducer,
    [categorySlice.reducerPath]: categorySlice.reducer,
    [ColorSlice.reducerPath]: ColorSlice.reducer,
    [SizeSlice.reducerPath]: SizeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ProductSlice.middleware,
      categorySlice.middleware,
      ColorSlice.middleware,
      SizeSlice.middleware,
    ]),
});
