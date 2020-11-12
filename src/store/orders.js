import { observable, computed, action, runInAction } from "mobx";

//global  experimentalDecorators
export default class {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.api = this.rootStore.api.orders;
  }

  @observable orders = [];
  @observable state = "empty"; // pending, done, error
  @observable stateOne = "empty"; // pending, done, error
  @observable order = {}; // отдельный заказ, получаемый через fetchOne

  @action fetchAll(params = "") {
    let str;
    if (typeof params === "string") {
      str = params;
    } else if (typeof params === "object") {
      str = "?";
      for (var key in params) {
        str += "" + key + "=" + params[key] + "&";
      }
    }

    this.state = "pending";
    return new Promise((resolve, reject) => {
      this.api.all(str).then(
        (data) => {
          runInAction(() => {
            this.orders = data;
            this.state = "done";
          });
          resolve(true);
        },
        (error) => {
          runInAction(() => {
            this.state = "error";
          });
        }
      );
    });
  }

  @action fetchOne(id) {
    this.stateOne = "pending";
    return new Promise((resolve, reject) => {
      this.api.one(id).then(
        (data) => {
          runInAction(() => {
            this.orders = data;
            this.stateOne = "done";
          });
          resolve(data);
        },
        (error) => {
          runInAction(() => {
            this.stateOne = "error";
          });
        }
      );
    });
  }

  orderByRoom = (id) => {
    return this.orders.filter((item) => item.roomId == id);
  };

  @action add(orderForm) {
    return new Promise((resolve, reject) => {
      this.api.add(orderForm).then((data) => {
        resolve(data);
      });
    });
  }

  @action edit(orderForm) {
    return new Promise((resolve, reject) => {
      this.api.edit(orderForm.id, orderForm).then((data) => {
        resolve(data);
      });
    });
  }

  @action delete(id) {
    return new Promise((resolve, reject) => {
      this.api.remove(id).then((data) => {
        resolve(true);
      });
    });
  }
}
