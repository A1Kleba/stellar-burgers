import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const initialState: { isLoading: boolean; ingredients: TIngredient[] } =
  {
    isLoading: false,
    ingredients: []
  };

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  () => getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredients.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredients.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = payload;
    });
    builder.addCase(getIngredients.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export default ingredientsSlice.reducer;
