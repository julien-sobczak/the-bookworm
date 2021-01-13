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
    paperSize: PropTypes.oneOf(["extended", "A4", "A5", "A6", "pocket", "digest", "paperback", "hardcover"]),
};

Paper.defaultProps = {
    ...Styled.defaultProps,
    paperSize: 'A5',
};

Paper.displayName = 'Paper';

export default Paper;
