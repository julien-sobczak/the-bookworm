import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Styled from './Styled';

it('supports additional CSS class names', () => {
    const { container } = render(<Styled className="MyDrill" />);
    expect(container.firstChild).toHaveClass('MyDrill');
});

it('supports setting the container ID', () => {
    const { container } = render(<Styled id="my-styled" />);
    expect(container.firstChild).toHaveAttribute('id', 'my-styled');
});

it('supports custom styles', () => {
    const { container } = render(<Styled style={{color: "red", backgroundColor: "yellow"}} />);
    expect(container.firstChild).toHaveStyle(`
        color: red;
        background-color: yellow;
    `);
});

it('copies children elements', () => {
    const { getByText } = render(
        <Styled style={{color: "red", backgroundColor: "yellow"}}>
            <p>This is a text</p>
        </Styled>
    );
    expect(getByText("This is a text")).toBeTruthy();
});

it('exposes attribute to define the style', () => {
    const { container } = render(
        <Styled fontFamily="Roboto" fontSize="16pt" fontStyle="bold">
            <p>Styled text</p>
        </Styled>
    );
    expect(container.firstChild).toHaveClass('Roboto');
    expect(container.firstChild).toHaveClass('Size16pt');
    expect(container.firstChild).toHaveClass('Bold');
});
