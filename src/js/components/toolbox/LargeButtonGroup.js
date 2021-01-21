import styled from 'styled-components';

/**
 * Container to group multiple <LargeButton> elements.
 */
const LargeButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    > * {
        /* Add space between buttons */
        margin: 1rem 0.5rem;
    }
`;

export default LargeButtonGroup;
