import React from 'react';
import { Badge } from '../common/mui-components';

const StateBadge = props => {

    let description = 'Sin estado';
    let variant = 'default';

    switch (props.state) {
        case 'Open':
            description = 'Abierta';
            variant = 'success';
            break;
        case 'Pending Admin':
            description = 'En espera';
            variant = 'warning';
            break;
        case 'Pending Owner':
            description = 'Pendiente';
            variant = 'info';
            break;
        case 'Close':
            description = 'Cerrada';
            variant = 'danger';
            break;
        default:
            break;
    }

    return (<Badge variant={variant}>{description}</Badge>)
}

export default StateBadge