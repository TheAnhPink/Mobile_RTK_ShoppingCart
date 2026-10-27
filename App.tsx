// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import CartScreen from './screen/CartScreen';


export default function App() {
  return (
    <Provider store={store}>
      <CartScreen />
    </Provider>
  );
}