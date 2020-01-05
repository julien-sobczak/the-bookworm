# React Cheatsheet

## Components

2 ways to create components: functional vs class components:

```javascript
// Functional component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

```javascript
// Class component
import React from 'react';

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Reference: [React Documentation](https://reactjs.org/docs/components-and-props.html)

## State Management

```javascript
import React from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    // Same as:
    // this.setState(state => ({
    //   ...state
    //   isToggleOn: !state.isToggleOn
    // }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

React Hooks:

```javascript
import React, { useState } from 'react';

function Toggle(props) {
  const [isToggleOn, setToggleOn] = useState(true);

  const handleClick = () => {
    setToggleOn(!isToggleOn)
  }

  return (
    <button onClick={handleClick}> {/* or onClick={() => setToggleOn(!isToggleOn)} */}
      {this.state.isToggleOn ? 'ON' : 'OFF'}
    </button>
  );
}
```

Reference: [React documentation](https://reactjs.org/docs/hooks-intro.html)

Hooks: [useState](https://reactjs.org/docs/hooks-reference.html#usestate),
[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect),
[useContext](https://reactjs.org/docs/hooks-reference.html#usecontext),
[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer),
[useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback),
[useMemo](https://reactjs.org/docs/hooks-reference.html#usememo),
[useRef](https://reactjs.org/docs/hooks-reference.html#useref),
[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle),
[useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect),
[useDebugValue](https://reactjs.org/docs/hooks-reference.html#usedebugvalue).

## DOM references

Class component:

```javascript
import React from 'react';

class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    return (
      <>
        <input type="text" ref={this.textInput} />
        <input type="button" value="Focus" onClick={this.focusTextInput} />
      </>
    );
  }
}
```

Reference: [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)

React Hook:

```javascript
import React, { useRef } from 'react';

function CustomTextInput(props) {
  // create a ref to store the textInput DOM element
  const textInput = useRef(null);

  const focusTextInput = () => {
    textInput.current.focus();
  }

  return (
    <>
      <input type="text" ref={textInput} />
      <input type="button" value="Focus" onClick={focusTextInput} />
    </>
  );
}
```

Reference: [useRef](https://reactjs.org/docs/refs-and-the-dom.html)

## JavaScript export/import

```javascript
import React, { useState } from 'react';
```

To export components:

```javascript
// Welcome.js

// Only one component to export
export default Welcome; // import Welcome from './Welcome';

// Several components to export
export { Welcome as default, Home };
// import Welcome from './Welcome';
// import Welcome, { Home } from './Welcome';

export { Welcome, Home };
// import { Welcome, Home } from './Welcome';
```

Reference: [Mozilla documentation](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)


Properties validation:

```javascript
import PropTypes from 'prop-types';

Welcome.propTypes = {
  ...Home.propTypes,                    // inherit from other component
  message: PropTypes.string.isRequired, // isRequired can be applied to any type
  onComplete: PropTypes.func,           // No way to be more specific

  // Types: array, bool, func, number, object, string, symbol, node, any

  // Examples:

  // React
  optionalElement: PropTypes.element,         // A React element.
  optionalElementType: PropTypes.elementType, // A React element type (ie. MyComponent).

  // An instance of a class (JS's instanceof operator).
  optionalMessage: PropTypes.instanceOf(Message),

  // Enum
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Collection
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Children
  children: PropTypes.node, // Anything that can be rendered: numbers, strings, elements or an array
  children: PropTypes.any,  // Or in last resort
};

Welcome.defaultProps = {
    ...Home.defaultProps, // inherit from other component

    // Don't declare defaults for required properties
};
```

Reference: [React documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)

## Forward Refs

Ref forwarding is a technique for automatically passing a `ref` through a component to one of its children.

```javascript
import React from 'react';

const Paper = React.forwardRef((props, ref) => {
    return (
        <div className="Paper">
            <div className="PaperContent" ref={ref}>
                  {props.children}
            </div>
        </div>
    );
});

Paper.displayName = 'Paper';

export default Paper;
```

Reference: [Forwarding refs](https://reactjs.org/docs/forwarding-refs.html)

## CSS

1. Use external CSS stylesheets

```javascript
import React from 'react';
import './Welcome.css';

function Welcome() {
  return <h2 className="Headline">Welcome!</h2>;
}

// Welcome.css
.Headline { text-align: center}
```

2. Use inline styles

```javascript
import React from 'react';

function Welcome() {
  const styles: {
    headline: {
      textAlign: "center",
    },
  };
  return <h2 style={styles.headline}>Welcome!</h2>;
  // Or  <h2 style={{...styles.styleA, ...styles.styleB}}>Merged styles</h2>;
  // Or  <h2 style={{textAlign: "center"}}>Inline style</h2>;
}
```

3. Use project [`styled-components`](https://github.com/styled-components/styled-components)

```
$ npm install styled-components
```

```javascript
import React from 'react';
import styled from 'styled-components';

function Button({ colorText, colorBackground }) {

  const Button = styled.button`
    color: ${colorText};
    position: relative;

    :before {
      content: "";
      background: ${colorBackground};
      width: 56px;
      height: 56px;
    }
    :hover:before {
      width: 100%;
      background: ${colorBackground};
      opacity: 1;
    }
    :active {
      transform: scale(.96);
    }
  `;

  return (
    <Button>Click Me!</Button>
  );
}
```

Tricks!

CSS Animations:

```javascript
const rotate = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  25%, 100% {
    transform: rotateX(90deg);
  }
`;
const Piece = styled.div`
  display: inline-block;
  animation: 1s ${rotate} 2s ease-in-out 0s infinite;
`;
```

Mixin:

```javascript
const piece = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  position: absolute;
`;
const PieceTop = styled.div`
  ${piece}
  top: 0px;
`;
```

Inheritance:

```javascript
const Button = styled.button`
  color: palevioletred;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;
```

## File organization

```
myproject/
  node_modules/ ......... NPN
  public/  .............. Assets
    css/   .............. CSS for homepage
    images/ ............. Images (including favicon)
    lib/
    index.html .......... Entry point
    manifest.json
  src/
    css/ ................ Additional stylesheets
      Common.css
      Home.css
    js/
      components/ ....... React components
        sectionA/ ....... Split per features
          ComponentA.js
        sectionB/
          ComponentB.js
        Home.js
      functions/ ........ Utility reusable functions
        string.js
      store/ ............ Redux
        actions.js
        reducers.js
        store.js
    App.css ............. Global stylesheet for React app
    App.js .............. Root React component
    App.test.js
    index.js ............ Entry point when using Create React App
```


## Redux

Configure the store:

```javascript
// store.js
import { createStore } from "redux";
import rootReducer from "./reducers";

const initialState = {
  preferences: {
    language: {
      native: "English",
    },
  }
};

// localStorage persistence implementation
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export { store as default, defaultState};

// actions.js
export const UPDATE_PREFERENCES = "UPDATE_PREFERENCES";

export function updatePreferences(payload) {
    return { type: UPDATE_PREFERENCES, payload };
}

// reducers.js
import * as actions from "./actions";

function rootReducer(state, action) {
  if (action.type === actions.UPDATE_LANGUAGE_PREFERENCES) {
    return {
      ...state,
      preferences: action.payload,
    };
  } // else if (action.type === actions.XXX) {

  return state;
}

export default rootReducer;
```

Map props/actions:

```javascript
import { connect } from "react-redux";

// ...

const mapStateToProps = state => {
  return {
      preferences: state.preferences,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      updatePreferences: prefs => dispatch(updatePreferences(prefs)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
```

Reference: [Redux + Hooks](https://react-redux.js.org/next/api/hooks)

## CLI

```bash
$ npm start        # Start the application
$ CI=true npm test # Rerun all tests
```
