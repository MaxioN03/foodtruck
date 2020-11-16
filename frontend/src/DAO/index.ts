export interface IProduct {
    name: string,
    category: string,
    cost: number,
    available: boolean,
    _id?: string
}

export default class DAOProducts {
    static async create(data: IProduct) {
        let response = await fetch('products', {
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
        let response = await fetch('products/', {
            mode: 'cors'
        });
        return response.json();
    }

    static getById(id: string) {
        fetch(`products/${id}`, {
            mode: 'cors'
        })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error
            })
    }

    static async removeById(id: string) {
        let response = await fetch(`products/${id}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        return response.json();
    }

    static async updateById(id: string, product: IProduct) {
        let response = await fetch(`products/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        return response.json();
    }
}