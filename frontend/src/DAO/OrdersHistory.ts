import {IOrderInfo} from "./Orders";

export default class DAOOrdersHistory {
    static async create(data: IOrderInfo) {
        let response = await fetch('orders_history', {
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
        let response = await fetch('orders_history/', {
            mode: 'cors'
        });
        return response.json();
    }

    static getById(id: string) {
        fetch(`orders_history/${id}`, {
            mode: 'cors'
        })
            .then(response => {
                console.log('response', response);
                return response;
            })
            .catch(error => {
                return error
            })
    }

    static async removeById(id: string) {
        let response = await fetch(`orders_history/${id}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        return response;
    }

    static async updateById(id: string, order: IOrderInfo) {
        let response = await fetch(`orders_history/${id}`, {
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