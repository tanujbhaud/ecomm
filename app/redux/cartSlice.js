import { createSlice } from "@reduxjs/toolkit";

// Check if window object is defined (indicating browser environment)
const isBrowser = typeof window !== "undefined";

// Define initial state function to retrieve from localStorage
const getInitialState = () => {
  if (isBrowser) {
    return JSON.parse(localStorage.getItem("cart")) ?? [];
  } else {
    return [];
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },
    deleteFromCart(state, action) {
      return state.filter((item) => item.id != action.payload.id);
    },
    incrementQuantity: (state, action) => {
      state = state.map((item) => {
        if (item.id === action.payload) {
          item.quantity++;
        }
        return item;
      });
    },
    decrementQuantity: (state, action) => {
      state = state.map((item) => {
        if (item.quantity !== 1) {
          if (item.id === action.payload) {
            item.quantity--;
          }
        }
        return item;
      });
    },
    emptyCart: (state) => {
      return [];
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  incrementQuantity,
  decrementQuantity,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;
