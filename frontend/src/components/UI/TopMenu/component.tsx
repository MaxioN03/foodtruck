import * as React from 'react';
import './style.css';

const LINKS: {displayName: string, link: string}[] = [
    {displayName: 'Дом', link: ''},
    {displayName: 'Продукты', link: 'products'},
    {displayName: 'Создать заказ', link: 'create_order'},
    {displayName: 'Менеджер заказов', link: 'order_manager'},
    {displayName: 'Окно заказов', link: 'orders_window'},
];

interface ITopMenuProps {

}

interface ITopMenuState {
}

export default class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

    render() {
        return <div className={'top_menu'}>
            {LINKS.map(linkItem => {
                let {displayName, link} = linkItem;
                return <a key={link} className={'top_menu_link'} href={`/${link}`}>{displayName}</a>
            })}
        </div>
    }
}
