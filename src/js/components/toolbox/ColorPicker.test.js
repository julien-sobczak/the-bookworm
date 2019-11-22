import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ColorPicker from './ColorPicker';

it('renders without crashing', () => {
  const { getByTestId } = render(<ColorPicker />);
  expect(getByTestId('swatch')).not.toBeNull();
});
