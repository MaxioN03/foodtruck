import * as React from 'react';
import './style.css';
import {default as DAOProducts, IProduct} from "../../DAO";
import Modal from "../UI/Modal/component";
import Button from "../UI/Button/component";
import Input from "../UI/Input/component";
import TopMenu from "../UI/TopMenu/component";
import Spin from "../UI/Spin/component";
import {Error} from "tslint/lib/error";
import CheckBox from "../UI/CheckBox/component";
import InteractiveLine from "../UI/InteractiveLine/component";

interface IProductsState {
    isLoading: boolean,
    loadingError: Error | null,
    isEditingAvailable: boolean,
    editingAvailableError: Error | null,
    products: IProduct[],
    isOpenCreateModal: boolean,
    editingProduct: IProduct | null
    removingProduct: IProduct | null
}

export default class Products extends React.Component<{}, IProductsState> {
    state = {
        isLoading: false,
        loadingError: null,
        isEditingAvailable: false,
        editingAvailableError: null,
        products: [],
        formData: {name: '', category: '', cost: 0},
        isOpenCreateModal: false,
        editingProduct: null,
        removingProduct: null
    };

    componentDidMount() {
        this.getProducts(true);
    }

    getProducts(initial = false) {
        this.setState({isLoading: initial, loadingError: null, editingAvailableError: null}, () => {
            DAOProducts.getAll().then(products => {
                this.setState({products, isLoading: false});
            }).catch(loadingError => {
                this.setState({loadingError, isLoading: false});
            });
        });
    }

    openCreateModal() {
        this.setState({isOpenCreateModal: true});
    }

    closeCreateModal(success: boolean = false) {
        this.setState({isOpenCreateModal: false, editingAvailableError: null}, () => {
            if (success) {
                this.getProducts(true);
            }
        });
    }

    openEditModal(editingProduct: IProduct) {
        this.setState({editingProduct});
    }

    closeEditModal(success: boolean = false) {
        this.setState({editingProduct: null}, () => {
            if (success) {
                this.getProducts(true);
            }
        });
    }

    openRemoveConfirm(removingProduct: IProduct) {
        this.setState({removingProduct, editingAvailableError: null});
    }

    closeRemoveConfirm(success: boolean = false) {
        this.setState({removingProduct: null, editingAvailableError: null}, () => {
            if (success) {
                this.getProducts(true);
            }
        });
    }

    onAvailableChange(product: IProduct, value: boolean) {
        this.setState({isEditingAvailable: true, editingAvailableError: null}, () => {
            DAOProducts.updateById(product._id || '', Object.assign({}, product, {available: value}))
                .then(() => {
                    this.setState({isEditingAvailable: false});
                    this.getProducts(false);
                })
                .catch(editingAvailableError => {
                    this.setState({editingAvailableError, isEditingAvailable: false});
                });
        });
    }

    render() {
        let {isLoading, loadingError, products, isOpenCreateModal, isEditingAvailable, editingAvailableError} = this.state;
        let editingProduct: any = this.state.editingProduct;
        let removingProduct: any = this.state.removingProduct;

        return (
            <div>
                <TopMenu/>
                <div className={'products'}>
                    <h2>Продукты:</h2>
                    {editingAvailableError
                        ? <span className={'error_message'}>Ошибка при изменении статуса наличия</span>
                        : null}
                    {loadingError
                        ? <div className={'error_message'}>Ошибка при загрузке продуктов</div>
                        : isLoading
                            ? <Spin centered size={'l'}/>
                            : products.length
                                ? <table className={'app_table'}>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Название</th>
                                        <th>Категория</th>
                                        <th>Цена, BYN</th>
                                        <th>Наличие</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((product, index) => {
                                        let {name, category, cost, available} = product;
                                        return <tr>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{category}</td>
                                            <td>{cost}</td>
                                            <td>
                                                <CheckBox initialChecked={available} disabled={isEditingAvailable}
                                                          onChange={this.onAvailableChange.bind(this, product)}/>
                                            </td>
                                            <td>
                                                <InteractiveLine disabled={isEditingAvailable}
                                                                 onClick={this.openEditModal.bind(this, product)}>
                                                    Изменить
                                                </InteractiveLine>
                                            </td>
                                            <td>
                                                <InteractiveLine disabled={isEditingAvailable}
                                                                 onClick={this.openRemoveConfirm.bind(this, product)}>
                                                    Удалить
                                                </InteractiveLine>
                                            </td>
                                        </tr>;
                                    })}
                                    </tbody>
                                </table>
                                : <h3>Продукты не найдены</h3>}
                    <Button disabled={isEditingAvailable} title={'Добавить продукт'}
                            onClick={this.openCreateModal.bind(this)}/>
                    {
                        isOpenCreateModal
                            ? <CreateModal onClose={this.closeCreateModal.bind(this)}/>
                            : null
                    }
                    {
                        editingProduct
                            ? <EditModal product={editingProduct} onClose={this.closeEditModal.bind(this)}/>
                            : null
                    }
                    {
                        removingProduct
                            ? <RemoveModal product={removingProduct} onClose={this.closeRemoveConfirm.bind(this)}/>
                            : null
                    }
                </div>
            </div>
        );
    }
}

interface ICreateModalProps {
    onClose: (success?: boolean) => void
}

interface ICreateModalState {
    formData: { name: string, category: string, cost: number },
    isCreating: boolean,
    creatingError: Error | null
}

class CreateModal extends React.Component<ICreateModalProps, ICreateModalState> {
    state = {
        formData: {name: '', category: '', cost: 0},
        isCreating: false,
        creatingError: null
    };

    onFormDataChange(field: string, value: string | number) {
        let formData: any = this.state.formData;
        formData[field] = value;
        this.setState({formData});
    }

    onCreate() {
        let formData: any = this.state.formData;
        this.setState({isCreating: true, creatingError: null}, () => {
            DAOProducts.create(formData)
                .then(() => {
                    this.setState({isCreating: false});
                    this.props.onClose(true);
                })
                .catch(creatingError => {
                    this.setState({creatingError, isCreating: false});
                });
        });
    }

    render() {
        let {onClose} = this.props;
        let {formData, isCreating, creatingError} = this.state;

        return <Modal title={'Добавить продукт'} onClose={onClose.bind(this)}>
            <div className={'add-form'}>
                <Input placeholder={'Название'} onChange={this.onFormDataChange.bind(this, 'name')}/>
                <Input placeholder={'Категория'}
                       onChange={this.onFormDataChange.bind(this, 'category')}/>
                <Input placeholder={'Цена'} type={'number'} step="0.01"
                       onChange={this.onFormDataChange.bind(this, 'cost')}/>
            </div>
            <Button title={'Добавить'}
                    onClick={this.onCreate.bind(this)}
                    disabled={!formData.name || !formData.category || !formData.cost}/>
            {isCreating ? <Spin size={'s'}/> : null}
            {creatingError ? <div className={'error_message'}>Ошибка при создании продукта</div> : null}
        </Modal>;
    }
}

interface IEditModalProps {
    onClose: (success?: boolean) => void,
    product: IProduct
}

interface IEditModalState {
    formData: { name: string, category: string, cost: number },
    isEditing: boolean,
    editingError: Error | null
}

class EditModal extends React.Component<IEditModalProps, IEditModalState> {
    state = {
        formData: {name: '', category: '', cost: 0},
        isEditing: false,
        editingError: null
    };

    componentDidMount() {
        let {product} = this.props;
        this.setState({formData: {name: product.name, category: product.category, cost: product.cost}});
    }

    onFormDataChange(field: string, value: string | number) {
        let formData: any = this.state.formData;
        formData[field] = value;
        this.setState({formData});
    }

    onEdit() {
        let {onClose, product} = this.props;
        let {formData} = this.state;

        this.setState({isEditing: true, editingError: null}, () => {
            DAOProducts.updateById(product._id || '', Object.assign({available: product.available}, formData))
                .then(() => {
                    this.setState({isEditing: false});
                    onClose(true);
                })
                .catch(editingError => {
                    this.setState({editingError, isEditing: false});
                });
        });
    }

    render() {
        let {onClose, product} = this.props;
        let {formData, isEditing, editingError} = this.state;

        return <Modal title={'Изменить продукт'} onClose={onClose.bind(this)}>
            <div className={'add-form'}>
                <Input disabled initialValue={product._id} placeholder={'id'}
                       onChange={() => {
                       }}/>
                <Input initialValue={formData.name} placeholder={'Название'}
                       onChange={this.onFormDataChange.bind(this, 'name')}/>
                <Input initialValue={formData.category} placeholder={'Категория'}
                       onChange={this.onFormDataChange.bind(this, 'category')}/>
                <Input initialValue={formData.cost} placeholder={'Цена'} type={'number'} step="0.01"
                       onChange={this.onFormDataChange.bind(this, 'cost')}/>
            </div>
            <Button title={'Изменить'}
                    onClick={this.onEdit.bind(this)}
                    disabled={!formData.name || !formData.category || !formData.cost}/>
            {isEditing ? <Spin size={'s'}/> : null}
            {editingError ? <div className={'error_message'}>Ошибка при редактировании продукта</div> : null}
        </Modal>;
    }
}


interface IRemoveModalProps {
    onClose: (success?: boolean) => void,
    product: IProduct
}

interface IRemoveModalState {
    isRemoving: boolean,
    removingError: Error | null
}

class RemoveModal extends React.Component<IRemoveModalProps, IRemoveModalState> {
    state = {
        isRemoving: false,
        removingError: null
    };

    onRemove(product: IProduct) {
        let {_id} = product;
        this.setState({isRemoving: true, removingError: null}, () => {
            DAOProducts.removeById(_id || '')
                .then(() => {
                    this.setState({isRemoving: false});
                    this.props.onClose(true);
                })
                .catch(removingError => {
                    this.setState({removingError, isRemoving: false});
                });
        });
    }

    render() {
        let {onClose, product} = this.props;
        let {isRemoving, removingError} = this.state;

        return <Modal title={'Удаление'} onClose={onClose.bind(this)}>
            <div>Действительно удалить продукт <span
                className={'product_name'}>{product.name} ({product.cost} BYN)</span>?
            </div>
            <Button title={'Удалить'}
                    onClick={this.onRemove.bind(this, product)}/>
            {isRemoving ? <Spin size={'s'}/> : null}
            {removingError ? <div className={'error_message'}>Ошибка при удалении продукта</div> : null}
        </Modal>;
    }
}