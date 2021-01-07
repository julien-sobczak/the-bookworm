import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LargeButton from './LargeButton';


it('allows text customization', () => {
    const { queryByText } = render(<LargeButton text="Click" />);
    expect(queryByText('Click')).toBeTruthy();
});

test('notifies on click', () => {
    const handleClick = jest.fn();
    const { container } = render(
        <LargeButton onClick={handleClick} />
    );
    const button = container.firstChild;
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
});
