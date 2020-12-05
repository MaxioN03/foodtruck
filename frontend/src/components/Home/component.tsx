import * as React from 'react';
import './style.css';
import TopMenu from "../UI/TopMenu/component";
import Spin from "../UI/Spin/component";
import {Error} from "tslint/lib/error";

interface IHomeProps {
}

interface IHomeState {
    isIpLoading: boolean,
    ip: string | null
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state = {
        isIpLoading: false,
        ip: null
    };

    componentDidMount() {
        this.setState({isIpLoading: true}, () => {
            fetch('ip/', {
                mode: 'cors'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('IP not founded');
                    } else {
                        return response.text();
                    }
                })
                .then(ip => {
                    this.setState({ip, isIpLoading: false});
                })
                .catch(() => {
                    this.setState({isIpLoading: false});
                });
        });
    }

    render() {
        let {ip, isIpLoading} = this.state;

        return (
            <div>
                <TopMenu/>
                <div className={'home'}>
                    <h1>Домашняя страница ааааа</h1>
                    <h3>Для навигации используйте меню сверху</h3>
                    {isIpLoading
                        ? <Spin size={'s'}/>
                        : ip
                            ? <h3>Для подключения перейдите по адресу: <i>{ip}:3000</i></h3>
                            : <h3 className={'error_message'}>Не удалось вычислить ip-адрес</h3>}
                    {!isIpLoading
                        ? <h4 className={'error_message'}>Иначе в командной строке (cmd) ввести ipconfig</h4>
                        : null}
                </div>

            </div>
        );
    }
}
