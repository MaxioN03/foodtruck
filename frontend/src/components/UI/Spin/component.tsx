import * as React from 'react';
import './style.css';

interface ISpinProps {
    size?: 'l' | 'm' | 's' | 'xs',
    centered?: boolean
}

interface ISpinState {
}

export default class Spin extends React.Component<ISpinProps, ISpinState> {

    render() {
        let {size = 'm', centered} = this.props;
        return <div className={`spinner size_${size} ${centered ? 'centered' : ''}`}/>
    }
}
