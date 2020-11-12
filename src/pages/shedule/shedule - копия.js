import React, { Component } from "react";
import "antd/dist/antd.css";
import withStore from "~/hocs/withStore";
import { NavLink } from "react-router-dom";
import { urlBuilder } from "~/routes";
import moment from "moment";
import classNames from "classnames";

class Shedule extends Component {
  componentDidMount() {
    this.props.stores.admin.fetchAll({ _expand: "type" });
  }

  showCalendar(date = new Date(), days = 60) {
    let calend = [];
    for (let day = 0; day < days; ++day) {
      let d = (
        <div className="shedule__day" key={day}>
          <div className="day">
            {moment(date).add(day, "days").format("LL")}
          </div>
        </div>
      );
      calend.push(d);
    }
    return calend;
  }

  render() {
    moment.locale("ru");

    let adminModel = this.props.stores.admin;
    let rooms = adminModel.rooms.map((item, i) => {
      let calend = [];
      for (let day = 0; day < 60; ++day) {
        let busy = false;
        let date = new Date();
        if (Array.prototype.slice.call(item.reserved).length) {
          let d = moment(date).add(day, "days");
          for (let res of item.reserved) {
            if (
              moment(d).isBefore(res.start) ||
              moment(d).isSameOrAfter(res.finish)
            ) {
              busy = false;
            } else {
              busy = true;
              break;
            }
          }
        }
        let cls = classNames("shedule__day", busy ? "busy" : null);
        let td = (
          <div className={cls} key={moment(date).add(day, "days").format("L")}>
            <div className="day">
              {moment(date).add(day, "days").format("DD.MM/dd")}
            </div>
          </div>
        );
        calend.push(td);
      }

      return (
        <div className="shedule__row" key={item.id}>
          <div className="shedule__head">
            <NavLink
              className="_room__link"
              to={urlBuilder("room", { id: item.typeId })}
            >
              {item.type.name}&nbsp;${item.type.price} #{item.id}
            </NavLink>
          </div>
          {calend}
        </div>
      );
    });

    return (
      <React.Fragment>
        <h2>Расписание:</h2>
        <div className="shedule-container">
          <div className="shedule">
            <div className="shedule__head-row">
              <div className="shedule__head">Номера:</div>
              {this.showCalendar()}
            </div>
            {rooms}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withStore(Shedule);
