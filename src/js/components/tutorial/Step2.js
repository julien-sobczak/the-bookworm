import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from '../toolbox/Text';

import Tooltip from '@material-ui/core/Tooltip';

import InfoIcon from '@material-ui/icons/Info';
import DesktopIcon from '@material-ui/icons/DesktopMac';
import TabletIcon from '@material-ui/icons/TabletMac';
import PhoneIcon from '@material-ui/icons/Smartphone';
import CompatibleIcon from '@material-ui/icons/CheckCircle';
import IncompatibleIcon from '@material-ui/icons/Cancel';

function Step2() {

    const Device = ({ title, icon, compatible }) => {
        const Container = styled.div`
            position: relative;
            margin: 2rem;

            .compatibility {
                position: absolute;
                bottom: -1rem;
                left: 75%;

                svg > path {
                    stroke: white;
                    stroke-width: 3px;
                    stroke-linejoin: round;
                }
            }
        `;
        return (
            <Container>
                <Tooltip title={title}>{icon}</Tooltip>
                {compatible && <CompatibleIcon fontSize="large" className="compatibility" style={{ color: "green" }} />}
                {!compatible && <IncompatibleIcon fontSize="large" className="compatibility" style={{ color: "black" }} />}
            </Container>
        );
    };
    Device.propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        compatible: PropTypes.bool.isRequired,
    };

    const DeviceList = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
    `;

    return (
        <>
            <h2>How to Use The Bookworm?</h2>

            <p><em>The Bookworm</em> is a web application meaning <strong>you only need a web browser to use it</strong>. The application has been tested on Google Chrome running on Android, MacOs, and Windows but web standards make it likely that the application will work great on other modern browsers.</p>

            <DeviceList>
                <Device title="Desktop" icon={<DesktopIcon fontSize="large" />} compatible={true} />
                <Device title="Tablet"  icon={<TabletIcon fontSize="large" />} compatible={true} />
                <Device title="Phone"   icon={<PhoneIcon fontSize="large" />} compatible={false} />
            </DeviceList>

            <p className="alignCenter">
                <Text manuscript={true} arrow={true} arrowDirection="top" arrowPosition="right"><InfoIcon/> The application can be installed on your home screen<br/>to practice in a more focused way!</Text>
            </p>
        </>
    );
}

export default Step2;
