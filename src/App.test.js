import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import App from './App';

it('renders without crashing', () => {
  const store = {
    getState: jest.fn(() => ({
      readings: [],
    })),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  }
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
