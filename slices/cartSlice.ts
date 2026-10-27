import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  taxRate: number;
  shippingCost: number;
}

const initialState: CartState = {
  items: [],
  discountCode: null,
  taxRate: 0.1,
  shippingCost: 10
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.discountCode = null;
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      state.discountCode = action.payload;
    },
    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
    }
  }
});

export default cartSlice.reducer;
export const {
  loadCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
  setShippingCost
} = cartSlice.actions;

export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectDiscount = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discountRates: Record<string, number> = {
    'SUMMER10': 0.1,
    'SPECIAL20': 0.2
  };
  const rate = discountRates[state.cart.discountCode || ''] || 0;
  return subtotal * rate;
};

export const selectTax = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  return subtotal * state.cart.taxRate;
};

export const selectCartTotal = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discount = selectDiscount(state);
  const tax = selectTax(state);
  return subtotal - discount + tax + state.cart.shippingCost;
};

export const selectCartSummary = (state: RootState) => ({
  subtotal: selectSubtotal(state),
  discount: selectDiscount(state),
  tax: selectTax(state),
  shipping: state.cart.shippingCost,
  total: selectCartTotal(state),
  itemCount: state.cart.items.reduce((count, item) => count + item.quantity, 0)
});