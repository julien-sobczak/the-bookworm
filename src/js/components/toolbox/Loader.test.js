import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Loader from './Loader';

it('renders without crashing', async () => {
  const { getByTestId } = render(<Loader />);
  expect(getByTestId('rubik')).not.toBeNull();
});
