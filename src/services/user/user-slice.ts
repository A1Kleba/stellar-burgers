import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserThunk, authLogin, logoutThunk, authRegister, updateUserThunk } from './actions';

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  isAuth: boolean;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  isAuth: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    },
    setIsInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthInit: (state) => state.isInit,
    selectIsLoading: (state) => state.isLoading,
    selectIsAuth: (state) => state.isAuth
  },
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authLogin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
      state.isAuth = true;
    });
    builder.addCase(authLogin.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(authRegister.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authRegister.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
      state.isAuth = true;
    });
    builder.addCase(authRegister.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
      state.isAuth = !!payload.user;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isAuth = false;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.isInit = false;
      state.user = null;
      state.isAuth = false;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(updateUserThunk.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setIsInit, setIsLoading, setUser } = userSlice.actions;
export const { selectUser, selectIsAuthInit, selectIsLoading, selectIsAuth } = userSlice.selectors;

export default userSlice.reducer;
