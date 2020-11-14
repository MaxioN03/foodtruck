import * as React from 'react';
import './style.css';
import {default as DAOOrders, IOrderInfo} from "../../DAO/Orders";
import TopMenu from "../UI/TopMenu/component";
import DAOOrdersHistory from "../../DAO/OrdersHistory";
import {Error} from "tslint/lib/error";
import OrdersList from "./OrdersList/component";
import OrdersHistoryListList from "./OrdersHistoryList/component";

const LOAD_INTERVAL = 3000;

interface IOrderManagerProps {

}

interface IOrderManagerState {
    isOrdersLoading: boolean,
    ordersLoadingError: Error | null,
    orders: IOrderInfo[],

    isOrdersHistoryLoading: boolean,
    ordersHistoryLoadingError: Error | null,
    ordersHistory: IOrderInfo[],
}

export default class OrderManager extends React.Component<IOrderManagerProps, IOrderManagerState> {
    state = {
        isOrdersLoading: false,
        ordersLoadingError: null,
        orders: [],

        isOrdersHistoryLoading: false,
        ordersHistoryLoadingError: null,
        ordersHistory: []
    };

    componentDidMount() {
        this.getOrders(true);
        this.getOrdersHistory(true);
        setInterval(() => {
            this.getOrders();
            this.getOrdersHistory();
        }, LOAD_INTERVAL);
    }

    getOrders(initial = false) {
        this.setState({isOrdersLoading: initial, ordersLoadingError: null}, () => {
            DAOOrders.getAll()
                .then((orders: IOrderInfo[]) => {
                    this.setState({isOrdersLoading: false, orders});
                })
                .catch(ordersLoadingError => {
                    this.setState({ordersLoadingError, isOrdersLoading: false});
                });
        });
    }

    getOrdersHistory(initial = false) {
        this.setState({isOrdersHistoryLoading: initial, ordersHistoryLoadingError: null}, () => {
            DAOOrdersHistory.getAll()
                .then((ordersHistory: IOrderInfo[]) => {
                    this.setState({isOrdersHistoryLoading: false, ordersHistory});
                })
                .catch(ordersHistoryLoadingError => {
                    this.setState({ordersHistoryLoadingError, isOrdersLoading: false});
                });
        });
    }

    render() {
        let {isOrdersLoading, ordersLoadingError, isOrdersHistoryLoading, ordersHistoryLoadingError} = this.state;
        let orders: IOrderInfo[] = this.state.orders;
        let ordersHistory: IOrderInfo[] = this.state.ordersHistory;

        return (
            <div>
                <TopMenu/>
                <div className={'order_manager'}>
                    <h2>Текущие заказы:</h2>
                    <OrdersList isLoading={isOrdersLoading}
                                loadingError={ordersLoadingError}
                                orders={orders}/>
                    <h2>История заказов:</h2>
                    <OrdersHistoryListList isLoading={isOrdersHistoryLoading}
                                           loadingError={ordersHistoryLoadingError}
                                           ordersHistory={ordersHistory}/>
                </div>
            </div>
        );
    }
}