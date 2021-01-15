import styled from 'styled-components';

const LargeButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;

    & > * {
        /* Add space between buttons */
        margin: 0 0.5cm;
    }
`;

export default LargeButtonGroup;
