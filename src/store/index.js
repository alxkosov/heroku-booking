import { configure } from "mobx";

import notificationsStore from "./notifications";

import typesStore from "./types";
import roomsStore from "./rooms";
import adminStore from "./admin";
import orderStore from "./orders";

import * as types from "~/api/types";
import * as rooms from "~/api/rooms";
import * as orders from "~/api/orders";

configure({ enforceActions: "observed" });

class RootStore {
  constructor() {
    this.api = {
      types,
      rooms,
      orders,
    };

    this.storage = localStorage;

    this.notifications = new notificationsStore(this);
    this.types = new typesStore(this);
    this.rooms = new roomsStore(this);
    this.admin = new adminStore(this);
    this.orders = new orderStore(this);
  }
}

export default new RootStore();
