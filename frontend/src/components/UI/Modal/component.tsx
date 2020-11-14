import * as React from 'react';
import './style.css';

interface IModalProps {
    title?: string,
    onClose: () => void
}

interface IModalState {

}

class Modal extends React.Component<IModalProps, IModalState> {
    componentDidMount() {
        let body = document.getElementsByTagName('body')[0];
        body.classList.add('modal-open');
    }

    onClose(event: any) {
        if (event.target.className === 'middle') {
            this.props.onClose();

            let body = document.getElementsByTagName('body')[0];
            body.classList.remove('modal-open');
        }
    }

    render() {
        return (
            <div className="outer">
                <div className="middle" onMouseDown={this.onClose.bind(this)}>
                    <div className="inner">
                        <div className={'title'}>
                            {this.props.title}
                        </div>
                        <div className={'content'}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
