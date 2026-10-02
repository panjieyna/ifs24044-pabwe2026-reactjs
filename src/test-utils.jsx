import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import lostFoundsReducer from './features/lost-founds/states/reducer';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      lostFounds: lostFoundsReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}