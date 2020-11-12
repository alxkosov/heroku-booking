import { observable, computed, action, runInAction } from "mobx";

//global  experimentalDecorators
export default class {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.api = this.rootStore.api.types;
  }

  @observable types = [];
  @observable state = "empty"; // pending, done, error
  @observable stateOne = "empty"; // pending, done, error
  @observable type = {}; // отдельный тип номера, получаемый через fetchOne

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
            this.types = data;
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
            this.type = data;
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
}
