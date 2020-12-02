import * as React from 'react';
import './style.css';
import {default as DAOOrders, IOrderInfo, OrderStatus, OrderStatusDisplay} from "../../../DAO/Orders";
import DAOOrdersHistory from "../../../DAO/OrdersHistory";
import Modal from "../../UI/Modal/component";

interface IStatusLabelProps {
    order: IOrderInfo //OrderStatus
}

interface IStatusLabelState {
    isOpenChangeStatusModal: boolean
}

export default class StatusLabel extends React.Component<IStatusLabelProps, IStatusLabelState> {
    state = {
        isOpenChangeStatusModal: false
    };

    openChangeStatusModal() {
        this.setState({isOpenChangeStatusModal: true});
    }

    closeChangeStatusModal() {
        this.setState({isOpenChangeStatusModal: false});
    }

    changeStatus(newStatus: string) {
        if (newStatus === OrderStatus.ISSUED || newStatus === OrderStatus.CANCELED) {

            let {order} = this.props;
            order.status = newStatus;
            DAOOrdersHistory.create(order).then(() => {
                DAOOrders.removeById(order._id || '')
                    .then(() => {
                        this.closeChangeStatusModal();
                    });
            });
        }
        else {
            let {order} = this.props;
            order.status = newStatus;
            DAOOrders.updateById(order._id || '', order)
                .then(() => {
                    this.closeChangeStatusModal();
                });
        }
    }

    render() {
        let {order} = this.props;
        let {status} = order;
        let {isOpenChangeStatusModal} = this.state;
        let displayName = OrderStatusDisplay[status] || status;

        return <div>
            <div className={`status_label ${status}`} onClick={this.openChangeStatusModal.bind(this)}>
                {displayName}
            </div>
            {isOpenChangeStatusModal
                ?
                <Modal title={`Изменить статус (${order.clientName})`} onClose={this.closeChangeStatusModal.bind(this)}>
                    {Object.keys(OrderStatus).map(statusKey => {
                        let statusValue = OrderStatus[statusKey];
                        let statusDisplayName = OrderStatusDisplay[statusValue] || statusValue;

                        return <div key={statusValue} className={`status_label ${statusValue} big`}
                                    onClick={this.changeStatus.bind(this, statusValue)}>
                            {statusDisplayName}
                        </div>;
                    })}
                </Modal>
                : null}
        </div>;
    }
}
