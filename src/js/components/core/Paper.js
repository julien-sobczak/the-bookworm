import React from 'react';
import PropTypes from 'prop-types';

import Styled from './Styled';

import * as string from '../../functions/string';

const Paper = React.forwardRef((props, ref) => {

    const defaultClassName = props.className ? props.className + ' ': '';
    const paperCss = string.capitalize(props.paperSize);
    const css = `${defaultClassName}Paper${paperCss}`;

    return (
        <div data-testid="paper" className={"Paper " + css}>
            <div className="PaperContent Centered" ref={ref}>
                <Styled {...props}>
                    {props.children}
                </Styled>
            </div>
        </div>
    );
});

Paper.propTypes = {
    ...Styled.propTypes,
    paperSize: PropTypes.oneOf(["preview", "extended", "a4", "a5", "a6", "pocket", "digest", "paperback", "hardcover"]),
};

Paper.defaultProps = {
    ...Styled.defaultProps,
    paperSize: 'a5',
};

Paper.displayName = 'Paper';

export default Paper;
