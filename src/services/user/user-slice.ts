import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserThunk,
  authLogin,
  logoutThunk,
  authRegister,
  updateUserThunk
} from './userThunks';

export interface UserState {
  user: TUser | null;
  isInit: boolean;
  isAuth: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
}

export const initialState: UserState = {
  user: null,
  isInit: false,
  isAuth: false,
  isLoading: false,
  isAuthChecked: false
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
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
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
    selectIsAuth: (state) => state.isAuth,
    selectIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, handlePending)
      .addCase(authLogin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = true;
        state.isAuthChecked = true; // добавляем установку флага
      })
      .addCase(authLogin.rejected, handleRejected)

      .addCase(authRegister.pending, handlePending)
      .addCase(authRegister.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = true;
        state.isAuthChecked = true; // добавляем установку флага
      })
      .addCase(authRegister.rejected, handleRejected)

      .addCase(getUserThunk.pending, handlePending)
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = payload.user;
        state.isAuth = !!payload.user;
        state.isAuthChecked = true; // устанавливаем после успешной проверки
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true; // даже при ошибке — проверка завершена
      })

      .addCase(logoutThunk.pending, handlePending)
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isInit = false;
        state.user = null;
        state.isAuth = false;
        state.isAuthChecked = true; // проверка пройдена
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

export const { setIsInit, setIsLoading, setUser, authChecked } =
  userSlice.actions;
export const {
  selectUser,
  selectIsAuthInit,
  selectIsLoading,
  selectIsAuth,
  selectIsAuthChecked
} = userSlice.selectors;

export default userSlice.reducer;
