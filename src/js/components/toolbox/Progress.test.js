import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Progress from './Progress';

it('accepts the current progression', () => {
    const { getByTestId, queryByText } = render(<Progress value={40} />);
    expect(getByTestId("bar")).toHaveStyle('width: 40%');
    expect(queryByText("40 %")).toBeNull();
});