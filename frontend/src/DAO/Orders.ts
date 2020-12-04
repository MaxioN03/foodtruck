export const OrderStatus = {
    PAID: 'paid',
    COOKING: 'cooking',
    DONE: 'done',
    ISSUED: 'issued',
    CANCELED: 'canceled',
};

export const OrderStatusDisplay = {
    paid: 'Оплачен',
    cooking: 'Готовится',
    done: 'Готов',
    issued: 'Выдан',
    canceled: 'Отменён',
};

export interface IOrderInfo {
    clientName: string,
    products: { name: string, count: number }[],
    cost: number,
    status: string,
    createTime: number,
    comment?: string,
    _id?: string
}

export default class DAOOrders {
    static async create(data: IOrderInfo) {
        let response = await fetch('orders', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async getAll() {
        let response = await fetch('orders/', {
            mode: 'cors'
        });
        return response.json();
    }

    static getById(id: string) {
        fetch(`orders/${id}`, {
            mode: 'cors'
        })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error;
            });
    }

    static async removeById(id: string) {
        let response = await fetch(`orders/${id}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        return response;
    }

    static async updateById(id: string, order: IOrderInfo) {
        let response = await fetch(`orders/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        return response.json();
    }
}