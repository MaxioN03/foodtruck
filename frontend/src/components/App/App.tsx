import * as React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Products from "..//Products/component";
import OrderCreator from "..//OrderCreator/component";
import OrderManager from "..//OrderManager/component";
import Home from "../Home/component";
import OrdersWindow from "../OrdersWindow/component";

export default class App extends React.Component<{}, {}> {

    render() {
        return <BrowserRouter>
            <Switch>
                <Route exact path="/" render={() => <Home/>}/>
                <Route exact path="/products" component={() => <Products/>}/>
                <Route exact path="/create_order" component={() => <OrderCreator/>}/>
                <Route exact path="/order_manager" component={() => <OrderManager/>}/>
                <Route exact path="/orders_window" render={() => <OrdersWindow/>}/>
                {/*<Route component={NotFound} />*/}
            </Switch>
        </BrowserRouter>
    }
}