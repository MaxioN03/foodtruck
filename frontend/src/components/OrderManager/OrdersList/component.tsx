import * as React from 'react';
import moment = require("moment");
import {Error} from "tslint/lib/error";
import {IOrderInfo} from "../../../DAO/Orders";
import Spin from "../../UI/Spin/component";
import StatusLabel from "../StatusLabel/component";


interface IOrdersListProps {
    orders: IOrderInfo[],
    isLoading: boolean,
    loadingError: Error | null
}

interface IOrdersListState {

}

export default class OrdersList extends React.Component<IOrdersListProps, IOrdersListState> {
    render() {
        let {isLoading, loadingError} = this.props;
        let orders: IOrderInfo[] = this.props.orders;

        return loadingError
            ? <span className={'error_message'}> Ошибка при загрузке заказов</span>
            : isLoading
                ? <Spin size={'l'} centered/>
                : orders.length
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
                            {orders.map((order, index) => {
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
                    : <h4>Заказы не найдены</h4>;
    }
}