import * as React from 'react';
import './style.css';

interface IInputProps {
    placeholder?: string,
    disabled?: boolean,
    initialChecked?: boolean,
    onChange: (value: boolean) => void,
}

interface IInputState {
    checked: boolean
}

export default class CheckBox extends React.Component<IInputProps, IInputState> {
    state = {
        checked: false
    };

    componentDidMount() {
        if (this.props.initialChecked) {
            this.setState({checked: this.props.initialChecked});
        }
    }

    componentDidUpdate(prevProps: IInputProps) {
        if (this.props.initialChecked !== prevProps.initialChecked && this.props.initialChecked) {
            this.setState({checked: this.props.initialChecked});
        }
    }

    onChange(event: any) {
        let checked: boolean = event.target.checked;

        this.setState({checked}, () => {
            this.props.onChange(checked);
        });
    }

    render() {
        let {placeholder, disabled} = this.props;
        let {checked} = this.state;

        return <div>
            {placeholder
                ? <span>{placeholder}:</span>
                : null}
            <input type={'checkbox'}
                   disabled={disabled}
                   checked={checked}
                   className={'checkbox'}
                   onChange={this.onChange.bind(this)}/>
        </div>;
    }
}
