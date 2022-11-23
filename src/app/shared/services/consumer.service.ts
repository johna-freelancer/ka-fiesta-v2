import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart, Item } from 'app/layout/common/cart/cart.model';
import { environment } from 'environments/environment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, Observable } from 'rxjs';

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {
  /**
   *
   */
  constructor(
    private _http: HttpClient,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
    this._cart = new BehaviorSubject(this.getCart());
  }

  private _cart: BehaviorSubject<any>;

  /**
   * Setter & getter for config
   */
  set cart(value: any) {
    // Execute the observable
    this._cart.next(this.getCart());
  }

  get cart$(): Observable<any> {
    return this._cart.asObservable();
  }

  search(keyword) {
    return this._http.get(environment.API_ENDPOINT + '/v1/consumer/search?keyword=' + keyword);
  }

  getProducts(payload) {
    return this._http.post(environment.API_ENDPOINT + '/v1/consumer/products', payload);
  }

  addOrder(payload) {
    return this._http.post(environment.API_ENDPOINT + '/v1/orders/add', payload);
  }

  upload(file, id) {
    return this._http.post(environment.API_ENDPOINT + '/v1/orders/upload/'+id, file);
  }

  track(id) {
    return this._http.get(environment.API_ENDPOINT + '/v1/consumer/track/'+id);
  }

  listTransactions(payload) {
    return this._http.post(environment.API_ENDPOINT + '/v1/orders/getOrders', payload);
  }

  setSelectedStore(store) {
    localStorage.setItem('selectedStore', JSON.stringify(store));
  }

  getSelectedStore() {
    let store = localStorage.getItem('selectedStore');
    if (store == undefined) {
      return null;
    } else {
      return JSON.parse(store);
    }
  }

  clearSelectedStore() {
    localStorage.removeItem('selectedStore');
  }
  /**
   * 
   * @param data product that you want to add in the cart
   * @param store_name name of the store as a string
   * @param store_id id of the store as a number
   */
  setCart(data: Item, store_name, store_id) {
    let cart: Cart = this.getCart();
    data.quantity = 1;
    if (cart != null) {
      if (cart.store.id == store_id) {
        let items = cart.items;
        if (items.length <= 0) {
          items = [];
        }
        let index = items.findIndex(e => e.product_id == data.product_id);
        if (index != -1) {
          items[index].quantity++;
        } else {
          items.push(data);
        }
        cart.items = items;
        cart.total = this.getCartTotal();
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      else {
        this._fuseConfirmationService.open(
          {
            title: 'Warning',
            message: 'You have items in your cart that is not belong in this store. Do you want to proceed?',
            icon: {
              show: false,
              name: 'heroicons_outline:exclamation',
              color: 'warning'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Proceed',
                color: 'accent'
              },
              cancel: {
                show: true,
                label: 'Cancel'
              }
            },
            dismissible: true
          }).afterClosed().subscribe(result => {
            if (result == 'confirmed') {
              this.clearCart();
              let cart: Cart;
              data.quantity = 1;
              cart.items.push(data);
              cart.store.id = store_id;
              cart.store.name = store_name;
              cart.total = this.getCartTotal();
              localStorage.setItem('cart', JSON.stringify(cart));
            }
          });
      }
    }
    else {
      let cart = { store: { id: store_id, name: store_name }, items: [data], total: this.getCartTotal() }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    this._cart.next(this.getCart());
  }

  getCart(): Cart {
    let cart = localStorage.getItem('cart');
    if (cart == undefined) {
      return null;
    } else {
      let _cart = JSON.parse(cart);
      _cart.total = this.getCartTotal();
      return _cart;
    }
  }

  clearCart() {
    localStorage.removeItem('cart');
    this._cart.next(undefined);
  }

  getCartTotal() {
    let _cart = JSON.parse(localStorage.getItem('cart'));
    let total = 0;
    if (_cart) {
      _cart.items.forEach(item => {
        total += item.price * item.quantity;
      })
    }
    return total;
  }

  itemQuantityDeduct(product_id) {
    let cart = this.getCart();
    let items = cart?.items;
    cart.total = this.getCartTotal();
    let item = items.findIndex(e => {
      return e.product_id == product_id;
    });
    if (items[item].quantity == 1) {
      items.splice(item, 1);
    } else {
      items[item].quantity--;
    }
    this.clearCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    this._cart.next(this.getCart());
  }

  itemQuantityAdd(product_id) {
    let cart = this.getCart();
    let items = cart?.items
    cart.total = this.getCartTotal();
    let item = items.findIndex(e => {
      return e.product_id == product_id;
    });
    items[item].quantity++;
    this.clearCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    this._cart.next(this.getCart());
  }

  itemRemove(product_id) {
    let cart = this.getCart();
    let items = cart?.items
    cart.total = this.getCartTotal();
    let item = items.findIndex(e => {
      return e.product_id == product_id;
    });
    items.splice(item, 1);
    this.clearCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    this._cart.next(this.getCart());
  }

}


