import * as React from 'react';
import './style.css';

interface InteractiveLineProps {
    disabled?: boolean,
    onClick: () => void
}

interface InteractiveLineState {

}

export default class InteractiveLine extends React.Component<InteractiveLineProps, InteractiveLineState> {

    onClick() {
        let {disabled} = this.props;

        if (!disabled) {
            this.props.onClick();
        }
    }

    render() {
        let {disabled} = this.props;
        return <span onClick={this.onClick.bind(this)}
                     className={`interactive ${disabled ? 'disabled' : ''}`}>{this.props.children}</span>;
    }
}
