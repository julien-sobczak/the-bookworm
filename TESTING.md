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


## CLI

```bash
$ CI=true npm test                           # Run all tests in non-interactive mode
$ npm test src/js/**/*.test.js -- --coverage # Run jest coverage
```