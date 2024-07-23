// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  quantity: number;
}

interface CartState {
  items: BookData[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<BookData>) {
      const book = action.payload;
      const existingBook = state.items.find((item) => item.id === book.id);
      if (existingBook) {
        existingBook.quantity += 1;
      } else {
        state.items.push({ ...book, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload;
      const book = state.items.find((item) => item.id === id);
      if (book) {
        book.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
export type { CartState, BookData };
