import * as React from 'react';
import './style.css';
import {default as DAOProducts, IProduct} from "../../DAO";
import Button from "../UI/Button/component";
import Input from "../UI/Input/component";
import {default as DAOOrders, IOrderInfo, OrderStatus} from "../../DAO/Orders";
import TopMenu from "../UI/TopMenu/component";
import moment = require("moment");
import {Error} from "tslint/lib/error";
import Spin from "../UI/Spin/component";

interface IOrder {
    productName: string,
    cost: number,
    count: number,
    totalCost: number,
}

interface IOrderCreatorProps {

}

interface IOrderCreatorState {
    products: any,
    orders: IOrder[],
    name: string,
    isNewOrderCreated: boolean,
    isProductsLoading: boolean,
    productsLoadingError: Error | null,
}

export default class OrderCreator extends React.Component<IOrderCreatorProps, IOrderCreatorState> {
    state = {
        products: {},
        orders: [],
        name: '',
        isNewOrderCreated: false,
        isProductsLoading: false,
        productsLoadingError: null,
    };

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        this.setState({isProductsLoading: true, productsLoadingError: null}, () => {
            DAOProducts.getAll()
                .then((productsArray: IProduct[]) => {
                    let products = productsArray.reduce((result: any, product) => {
                        let {category} = product;

                        if (result[category]) {
                            result[category].push(product)
                        }
                        else {
                            result[category] = [product]
                        }

                        return result;

                    }, {});

                    this.setState({products, isProductsLoading: false});
                })
                .catch(productsLoadingError => {
                    this.setState({productsLoadingError, isProductsLoading: false});
                });
        });
    }

    onCardClick(product: IProduct, event: any) {
        let orders: IOrder[] = this.state.orders;

        if (event.target.className === 'order_info') {
            orders = orders.reduce((result: IOrder[], order) => {
                let {productName, count, cost} = order;

                if (productName !== product.name) {
                    result.push(order);
                }
                else {
                    if (count > 1) {
                        let newOrder: IOrder = {
                            productName: productName,
                            count: count - 1,
                            totalCost: (count - 1) * cost,
                            cost: cost
                        };

                        result.push(newOrder)
                    }
                }

                return result;
            }, []);
        }
        else {
            if (orders.some(order => order.productName === product.name)) {
                let currentProduct = orders.filter(order => order.productName === product.name)[0];
                currentProduct.count++;
                currentProduct.totalCost = currentProduct.count * currentProduct.cost;
            }
            else {
                orders.push({
                    productName: product.name,
                    cost: product.cost,
                    totalCost: product.cost,
                    count: 1
                })
            }
        }

        this.setState({orders, isNewOrderCreated: false})
    }

    onNameChange(name: string) {
        this.setState({name, isNewOrderCreated: false})
    }

    createOrder() {
        let orders: IOrder[] = this.state.orders;
        let name = this.state.name;

        let cost = orders.reduce((result: number, order) => {
            let {totalCost} = order;
            result += totalCost;
            return result;
        }, 0);

        let products = orders.map(order => {
            let {productName, count} = order;

            return {name: productName, count}
        });

        let order: IOrderInfo = {
            clientName: name,
            cost,
            products,
            status: OrderStatus.COOKING,
            createTime: +moment()
        };

        DAOOrders.create(order).then(() => {
            this.setState({orders: [], name: '', isNewOrderCreated: true});
        })
    }

    render() {
        let products: any = this.state.products;
        let orders: IOrder[] = this.state.orders;
        let name = this.state.name;
        let isNewOrderCreated = this.state.isNewOrderCreated;
        let {isProductsLoading, productsLoadingError} = this.state;

        return (
            <div>
                <TopMenu/>
                <div className={'order_creator'}>
                    <h2>Создать заказ:</h2>
                    {
                        productsLoadingError
                            ? <span className={'error_message'}>Ошибка при загрузке продуктов</span>
                            : isProductsLoading
                            ? <Spin size={'l'} centered/>
                            : Object.keys(products).sort().map(categoryKey => {
                                let productsByCategory = products[categoryKey];

                                return <div>
                                    <h2>{categoryKey}</h2>
                                    <div className={'product_cards_container'}>
                                        {productsByCategory.map((productByCategory: IProduct) => {
                                            let {name, cost, available} = productByCategory;
                                            let currentSelected = orders.filter(order => order.productName === productByCategory.name)[0];

                                            return <div className={`product_card ${available ? '' : 'unavailable'}`}
                                                        onClick={this.onCardClick.bind(this, productByCategory)}>
                                                <div className={'product_info'}>
                                                    <div className={'name'}>{name}</div>
                                                    <div className={'cost'}>{cost}</div>
                                                </div>
                                                <div className={'order_info'}>
                                                    {currentSelected ? currentSelected.count : null}
                                                </div>

                                            </div>
                                        })}
                                    </div>

                                </div>
                            })
                    }
                    <h2>Итог:</h2>
                    {orders.length
                        ? <div>
                            <table className={'app_table'}>
                                <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Цена</th>
                                    <th>Количество</th>
                                    <th>Сумма</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(order => {
                                    let {productName, count, cost, totalCost} = order;

                                    return <tr>
                                        <td>{productName}</td>
                                        <td>{cost}</td>
                                        <td>{count}</td>
                                        <td>{totalCost}</td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                            <div className={'total_cost'}>
                                <span className={'total_cost_title'}>Итого</span>
                                :
                                <span className={'total_cost_number'}>
                                {orders.reduce((result: number, order) => {
                                    let {totalCost} = order;
                                    result += totalCost;
                                    return result;
                                }, 0)}
                            </span>
                            </div>
                            <div>
                                <Input onChange={this.onNameChange.bind(this)} placeholder={'Имя'}/>
                            </div>
                            <Button title={'Создать заказ'} onClick={this.createOrder.bind(this)}
                                    disabled={!name || !orders.length}/>
                        </div>
                        : <h4>Товары не выбраны</h4>}
                    {isNewOrderCreated
                        ? <div>
                            <div>Заказ создан.</div>
                            <a href={'/order_manager'}>Перейти в менеджер</a>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}