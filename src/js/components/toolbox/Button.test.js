import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from './Button';


it('allows text customization', () => {
    const { queryByText } = render(<Button text="Click" />);
    expect(queryByText('Click')).toBeTruthy();
});

test('notifies on click', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Button onClick={handleClick} />
    );
    const button = container.firstChild;
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });