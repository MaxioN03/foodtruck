import * as React from 'react';
import './style.css';
import {default as DAOOrders, IOrderInfo, OrderStatus} from "../../DAO/Orders";

interface IOrdersWindowProps {

}

interface IOrdersWindowState {
    ordersCooking: IOrderInfo[],
    ordersDone: IOrderInfo[],
}

export default class OrdersWindow extends React.Component<IOrdersWindowProps, IOrdersWindowState> {
    state = {
        ordersCooking: [],
        ordersDone: [],
    };

    componentDidMount() {
        this.getOrders();
        setInterval(() => {
            this.getOrders();
        }, 3000)
    }

    getOrders() {
        DAOOrders.getAll().then((allOrders: IOrderInfo[]) => {
            let ordersCooking = allOrders.filter(order => order.status === OrderStatus.COOKING);
            let ordersDone = allOrders.filter(order => order.status === OrderStatus.DONE);
            this.setState({ordersCooking, ordersDone});
        })
    }

    render() {
        let {ordersCooking, ordersDone} = this.state;

        return <div className={'orders_window'}>
            <div className={'block cooking'}>
                <div className={'block_title'}>
                    <h1>Готовится</h1>
                </div>
                {ordersCooking.map(orderCooking => {
                    return <OrderBlock type={OrderStatus.COOKING} order={orderCooking}/>
                })}
            </div>
            <div className={'block done'}>
                <div className={'block_title'}>
                    <h1>Готово</h1>
                </div>
                {ordersDone.map(orderDone => {
                    return <OrderBlock type={OrderStatus.DONE} order={orderDone}/>
                })}
            </div>
        </div>
    }
}

interface IOrderBlockProps {
    type: string, //OrderStatus.COOKING | OrderStatus.DONE
    order: IOrderInfo
}

interface IOrderBlockState {
}

class OrderBlock extends React.Component<IOrderBlockProps, IOrderBlockState> {
    render() {
        let {type, order} = this.props;
        let {clientName} = order;

        return <div className={`order_block type_${type}`}>{clientName}</div>
    }
}
