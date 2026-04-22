import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserThunk, authLogin, logoutThunk, authRegister, updateUserThunk } from './userThunks';

export interface UserState {
  user: TUser | null,
  isInit: boolean,
  isAuth: boolean,
  isLoading: boolean
}

const initialState: UserState = {
  user: null,
  isInit: false,
  isAuth: false,
  isLoading: false
};

const handlePending = (state: UserState) => {
  state.isLoading = true;
};

const handleRejected = (state: UserState) => {
  state.isLoading = false;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      const user = action.payload;
      state.user = user;
      state.isAuth = user !== null;
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
    builder
      .addCase(authLogin.pending, handlePending)
      .addCase(authLogin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = true;
      })
      .addCase(authLogin.rejected, handleRejected)

      .addCase(authRegister.pending, handlePending)
      .addCase(authRegister.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = true;
      })
      .addCase(authRegister.rejected, handleRejected)

      .addCase(getUserThunk.pending, handlePending)
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = !!payload.user;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
      })

      .addCase(logoutThunk.pending, handlePending)
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isInit = false;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutThunk.rejected, handleRejected)

      .addCase(updateUserThunk.pending, handlePending)
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(updateUserThunk.rejected, handleRejected);
  }
});

export const { setIsInit, setIsLoading, setUser } = userSlice.actions;
export const { selectUser, selectIsAuthInit, selectIsLoading, selectIsAuth } = userSlice.selectors;

export default userSlice.reducer;
