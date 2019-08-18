import React from 'react';
import PropTypes from 'prop-types';
import Styled from '../toolbox/Styled';
import {capitalize} from '../toolbox/Fn'

const Paper = React.forwardRef((props, ref) => {
    const defaultClassName = props.className ? props.className + ' ': '';
    const paperCss = capitalize(props.paperSize);
    const css = `${defaultClassName}Paper${paperCss}`;

    return (
        <div className={"Paper " + css}>
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
    paperSize: PropTypes.string,
}

Paper.defaultProps = {
    ...Styled.defaultProps,
    paperSize: 'A5',
};

export default Paper;
