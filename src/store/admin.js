import { observable, computed, action, runInAction } from "mobx";

//global  experimentalDecorators
export default class {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.api = this.rootStore.api.rooms;
  }

  @observable rooms = [];
  @observable roomsOrder = []; // номера с бронью, включенной в массив
  @observable state = "empty"; // pending, done, error
  @observable stateOne = "empty"; // pending, done, error
  @observable room = {}; // отдельный автор, получаемый через fetchOne

  @observable dates = [];

  @observable startDate = new Date();
  @observable calendarInterval = 60;

  @action setStartDate(date) {
    this.startDate = date;
  }
  @action setCalendarInterval(days) {
    this.calendarInterval = days;
  }

  @action clearDates() {
    this.dates = [];
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

  // @action fetchAllWithOrders() {
  //   let str = `?_embed=orders`;
  //   this.stateOrders = "pending";
  //   return new Promise((resolve, reject) => {
  //     this.api.all(str).then(
  //       (data) => {
  //         runInAction(() => {
  //           this.roomsOrder = data;
  //           this.stateOrders = "done";
  //         });
  //         resolve(true);
  //       },
  //       (error) => {
  //         runInAction(() => {
  //           this.stateOrders = "error";
  //         });
  //       }
  //     );
  //   });
  // }

  // @computed get compiledData() {
  //   // console.log("ROOMS",this.rooms);
  //   // console.log("ROOMSwORDERs",this.roomsOrder);

  //   let newArr = [];
  //   if (this.rooms.length === this.roomsOrder.length)
  //     for (let i = 0; i < this.rooms.length; ++i) {
  //       newArr.push({ ...this.rooms[i], ...this.roomsOrder[i] });
  //     }
  //   return newArr;

  //   // if(this.rooms.length === this.roomsOrder.length){
  //   //   return this.rooms.map((item, i)=>{
  //   //     return {...item, ...this.roomsOrder[i]}
  //   //   });
  //   // } else {throw new Error("Массивы разной длины!!!")}
  // }

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
