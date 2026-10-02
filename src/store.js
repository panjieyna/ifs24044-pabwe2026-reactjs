import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import lostFoundsReducer from './features/lost-founds/states/reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    lostFounds: lostFoundsReducer,
  },
});

export default store;