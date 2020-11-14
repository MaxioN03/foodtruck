import * as React from 'react';
import './style.css';

interface IInputProps {
    placeholder?: string,
    disabled?: boolean,
    initialValue?: string | number,
    onChange: (value: number | string) => void,
    type?: string,
    step?: string,
}

interface IInputState {
    value: string | number
}

export default class Input extends React.Component<IInputProps, IInputState> {
    state = {
        value: ''
    };

    componentDidMount() {
        if (this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    componentDidUpdate(prevProps: IInputProps) {
        if (this.props.initialValue !== prevProps.initialValue && this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    onChange(event: any) {
        let value: string | number = event.target.value;
        this.setState({value}, () => {
            this.props.onChange(value)
        })
    }

    render() {
        let {placeholder, disabled, type, step} = this.props;
        let {value} = this.state;
        return <input placeholder={placeholder || ''}
                      disabled={disabled}
                      value={value}
                      className={'input'}
                      type={type}
                      step={step}
                      onChange={this.onChange.bind(this)}/>
    }
}
