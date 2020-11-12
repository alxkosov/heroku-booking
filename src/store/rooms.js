import { observable, computed, action, runInAction } from "mobx";

//global  experimentalDecorators
export default class {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.api = this.rootStore.api.rooms;
  }

  @observable rooms = [];
  @observable state = "empty"; // pending, done, error
  @observable stateOne = "empty"; // pending, done, error
  @observable room = {}; // отдельный номер, получаемый через fetchOne

  @observable dates = []; //даты конкретного текущего бронирования
  @observable numberGuests = 1; //данные бронирования
  @observable children = 0; //данные бронирования

  @action clearDates() {
    this.dates = [];
  }
  @action setDates(interval) {
    this.dates = interval;
  }
  @action setGuests(guests = 1) {
    this.numberGuests = guests;
  }

  @action setChildren(children = 0) {
    this.children = children;
  }

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
            this.rooms = data;
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
            this.room = data;
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

  @action add(roomForm) {
    return new Promise((resolve, reject) => {
      this.api.add(roomForm).then((data) => {
        resolve(data);
      });
    });
  }

  @action edit(roomForm) {
    return new Promise((resolve, reject) => {
      this.api.edit(roomForm.id, roomForm).then((data) => {
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
