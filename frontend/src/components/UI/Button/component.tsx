import * as React from 'react';
import './style.css';

interface IButtonProps {
    title?: string,
    disabled?: boolean,
    onClick: () => void
}

interface IButtonState {

}

export default class Button extends React.Component<IButtonProps, IButtonState> {

    onClick() {
        this.props.onClick()
    }

    render() {
        let {title, disabled} = this.props;
        return <button disabled={disabled} className={'button'} onClick={this.onClick.bind(this)}>{title}</button>
    }
}
