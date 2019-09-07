import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Countdown from './Countdown';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

it('starts at the given timer', () => {
    const { getByTestId } = render(<Countdown duration={2000}/>)
    expect(getByTestId('count')).toHaveTextContent('2')
});

it('triggers an event when the count is over', async () => {
    const handleTimesUp = jest.fn()
    render(<Countdown duration={1000} onTimesUp={handleTimesUp} />)
    await sleep(1500);
    expect(handleTimesUp).toHaveBeenCalledTimes(1)
});


