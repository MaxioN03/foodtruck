import * as React from 'react';
import moment = require("moment");
import {Error} from "tslint/lib/error";
import {IOrderInfo} from "../../../DAO/Orders";
import Spin from "../../UI/Spin/component";
import StatusLabel from "../StatusLabel/component";

interface IOrdersHistoryListProps {
    ordersHistory: IOrderInfo[],
    isLoading: boolean,
    loadingError: Error | null
}

interface IOrdersHistoryListState {

}

export default class OrdersHistoryListList extends React.Component<IOrdersHistoryListProps, IOrdersHistoryListState> {
    render() {
        let {isLoading, loadingError} = this.props;
        let ordersHistory: IOrderInfo[] = this.props.ordersHistory;

        return loadingError
            ? <span className={'error_message'}> Ошибка при загрузке заказов</span>
            : isLoading
                ? <Spin size={'l'} centered/>
                : ordersHistory.length
                    ? <div className={'app_table'}>
                        <table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Имя</th>
                                <th>Статус</th>
                                <th>Время создания</th>
                                <th>Продукты</th>
                                <th>Сумма</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ordersHistory.map((order, index) => {
                                let {clientName, cost, products, _id, createTime} = order;

                                return <tr key={_id}>
                                    <td>{index + 1}</td>
                                    <td>{clientName}</td>
                                    <td>
                                        <StatusLabel order={order}/>
                                    </td>
                                    <td>
                                        {createTime && moment(createTime).format('DD.MM.YYYY HH:mm') || '-'}
                                    </td>
                                    <td>
                                        {products.map(product => {
                                            return `${product.name} (${product.count})`;
                                        }).join(', ')}
                                    </td>
                                    <td>{cost}</td>
                                </tr>;
                            })}
                            </tbody>
                        </table>
                    </div>
                    : <h4>История заказов не найдена</h4>;
    }
}