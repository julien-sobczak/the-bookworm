# React Testing Cheatsheet


## Libraries

* Jest for unit tests
https://jestjs.io/docs/en/expect.html
  * Jest DOM when using React Testing Library
https://github.com/testing-library/jest-dom
  * Test CSS https://medium.com/@the_teacher/how-to-test-a-react-components-css-styles-with-react-testing-library-rtl-styled-components-43f744334528

* React testing library: https://testing-library.com/docs/react-testing-library/example-intro
https://testing-library.com/docs/react-testing-library/cheatsheet
  * To use extending Jest expect: https://github.com/testing-library/jest-dom
`import '@testing-library/jest-dom/extend-expect'`


## Unit Tests

Important: Files should be named `*.test.js`.

Utility functions:

```javascript
// No import required
import * as strings from './strings';
// Or import { random } from '/strings';

describe('random()', () => {

  it('should generate random texts', () => {
    expect(strings.random(10)).toHaveLength(10); 
  });

});
```

Reference: [Jest assertions](https://jestjs.io/docs/en/expect.html)

React component:

```javascript
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Welcome from './Welcome';

afterEach(cleanup);

it('displays Hello', async () => {
  const { queryByText } = render(<Welcome />);
  expect(queryByText("Hello")).toBeInTheDocument();
});
```

Reference: [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet) & [Jest DOM](https://github.com/testing-library/jest-dom#tobeinthedocument)

Simulate Click:

```javascript
// Form.js
import React, { useState } from 'react';

const Form = (props) => {

    const [native, setNative] = useState(props.native);
    const onChange = props.onChange;

    const handleNativeChange = (event) => {
        const newNative = event.target.value;
        if (native === newNative) return;
        setNative(newNative);
        onChange({
            native: newNative,
        });
    };

    return (
      <select data-testid="native" value={native} onChange={handleNativeChange}>
          <option value='English'>English</option>
          <option value='French'>French</option>
      </select>
    );
};

export default Form;

// Form.test.js
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

it('allows editing values', async () => {
  const mockFn = jest.fn();
  const { getByTestId } = render(<Form native="French" onChange={mockFn} />);

  // Change the native language
  fireEvent.change(getByTestId('native'), { target: { value: 'English' } })

  // Should trigger onChange event
  expect(mockFn.mock.calls.length).toEqual(1)
  expect(mockFn.mock.calls[0][0]).toMatchObject({
      native: "English",
  });
});
```

## Form

```javascript
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
```

### MUI Switch

```jsx
<Switch
  data-testid="keyboard"
  checked={keyboard}
  onChange={handleChange} />
```

```javascript
const keyboardSwitch = getByTestId('keyboard');
const keyboardCheckbox = keyboardSwitch.querySelector('[type="checkbox"]');
keyboardCheckbox.click();
fireEvent.change(keyboardCheckbox, { target: { checked: true } }); // enable
fireEvent.change(keyboardCheckbox, { target: { checked: '' } }); // disable
```

### Select

```jsx
<select data-testdi="span" onChange={handleChange} value={spans[i]}>
  {helpers.SPANS.map((s, index) => {
    return <option key={index} value={s}>{s}</option>;
  })}
</select>
```

```javascript
const spanSelect = getByTestId('span');
fireEvent.change(spansSelect, { target: { value: '2in' } })
```

### Custom radio button

```jsx
<tr>
  <th>Columns:</th>
  <td>
    <span data-testid="columns3" onClick={handleChange} className={"GraphicOption" + (columns === 3 ? ' selected' : '')} data-value={3}>3</span>
    <span data-testid="columns5" onClick={handleChange} className={"GraphicOption" + (columns === 5 ? ' selected' : '')} data-value={5}>5</span>
    <span data-testid="columns7" onClick={handleChange} className={"GraphicOption" + (columns === 7 ? ' selected' : '')} data-value={7}>7</span>
    <span data-testid="columns9" onClick={handleChange} className={"GraphicOption" + (columns === 9 ? ' selected' : '')} data-value={9}>9</span>
  </td>
</tr>
```

```javascript
fireEvent.click(getByTestId('columns5'));
```

### Input

```jsx
<tr>
  <th><label htmlFor="wpm">WPM</label>:</th>
  <td>
    <input id="wpm" type="number" min="100" max="5000" onChange={handleChange} value={wpm} />
  </td>
</tr>
```

```javascript
fireEvent.change(getByLabelText(/wpm/i), { target: { value: 500 } });
```

References:
* [More examples](https://github.com/testing-library/react-testing-library#more-examples)
* [Events](https://github.com/testing-library/dom-testing-library/blob/master/src/events.js)
* [Test absence/presence](http://testing-library.com/docs/guide-disappearance)


## CLI

```bash
$ CI=true npm test                           # Run all tests in non-interactive mode
$ npm test src/js/**/*.test.js -- --coverage # Run jest coverage
```