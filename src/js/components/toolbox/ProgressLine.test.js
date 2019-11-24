import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProgressLine from './ProgressLine';

it('accepts the current progression', () => {
    const { container } = render(<ProgressLine progress={50} color="white" />);
    expect(container.firstChild).toHaveStyle('background-color: white');
    expect(container.firstChild).toHaveStyle('width: 50%');
});
