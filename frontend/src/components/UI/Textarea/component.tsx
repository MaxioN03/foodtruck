import * as React from 'react';
import './style.css';

interface ITextAreaProps {
    placeholder?: string,
    disabled?: boolean,
    initialValue?: string | number,
    onChange: (value: number | string) => void
}

interface ITextAreaState {
    value: string | number
}

export default class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {
    state = {
        value: ''
    };

    componentDidMount() {
        if (this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    componentDidUpdate(prevProps: ITextAreaProps) {
        if (this.props.initialValue !== prevProps.initialValue && this.props.initialValue) {
            this.setState({value: this.props.initialValue});
        }
    }

    onChange(event: any) {
        let value: string | number = event.target.value;
        this.setState({value}, () => {
            this.props.onChange(value);
        });
    }

    render() {
        let {placeholder, disabled} = this.props;
        let {value} = this.state;
        return <textarea placeholder={placeholder || ''}
                         disabled={disabled}
                         value={value}
                         className={'input'}
                         onChange={this.onChange.bind(this)}/>;
    }
}
