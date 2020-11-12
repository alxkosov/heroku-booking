import React, { Component } from "react";
import "antd/dist/antd.css";
import withStore from "~/hocs/withStore";
import { NavLink } from "react-router-dom";
import { urlBuilder } from "~/routes";
import moment from "moment";
import classNames from "classnames";
import {
  Popover,
  Button,
  message,
  Input,
  DatePicker,
  Form,
  Modal,
  Select,
} from "antd";
import "./table.less";
import AdminOrderForm from "~c/adminOrderForm";

const errorMessage = (msg, duration = 1000, onClose = false) => {
  message.error(
    {
      content: msg,
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    },
    duration,
    onClose
  );
};

class TableRow extends Component {
  state = {
    firstBookingDate: null,
    bookingRoom: null,
    visible: false,
    start: null,
    finish: null,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  deleteBooking = async (e) => {
    await this.props.stores.orders.delete(e);
    await this.props.stores.orders.fetchAll();
  };

  componentDidMount() {
    this.props.stores.orders.fetchAll();
  }

  onCellMouseDown = (e) => {
    let el = e.currentTarget;
    let row = e.currentTarget;
    if (
      el.classList.contains("shedule__head") ||
      el.classList.contains("_room__link")
    ) {
      return; //выходим, если клик по заголовку
    }

    while (!el.classList.contains("shedule__day")) {
      el = el.parentNode;
    }
    while (!row.classList.contains("shedule__row")) {
      row = row.parentNode;
    }
    if (!el.dataset.busy) {
      this.setState({
        firstBookingDate: el.dataset.date,
        bookingRoom: el.dataset.id,
      });
    }

    function onMouseMove(event) {
      try {
        let select = event.target;
        while (!select.classList.contains("shedule__day")) {
          select = select.parentNode;
        }
        if (select.dataset.busy) {
          //errorMessage("На эти даты уже есть бронь!!!", 3000, true);
          row.removeEventListener("mousemove", onMouseMove);
          row.removeEventListener("mouseleave", onMouseLeave);
          el.onmouseup = null;
          throw new Error("На эти даты уже есть бронь!!!");
          return;
        }
        if (select.classList.contains("past")) {
          //throw new Error("Нельзя забронировать на дату в прошлом!");
          errorMessage("Нельзя забронировать на дату в прошлом!", 3000, true);
          row.removeEventListener("mousemove", onMouseMove);
          row.removeEventListener("mouseleave", onMouseLeave);
          el.onmouseup = null;
          return;
        }
        //if (!select.dataset.busy && !select.classList.contains("past"))
        select.classList.add("checked-for-booking");
      } catch (e) {
        errorMessage(e.message, 3000, true);
      }
    }

    function onMouseLeave(event) {
      row.removeEventListener("mousemove", onMouseMove);
      row.removeEventListener("mouseleave", onMouseLeave);
      el.onmouseup = null;

      //Очистка выделенных элементов
      let coll = event.target.querySelectorAll(".checked-for-booking");
      for (let item of coll) {
        if (item.classList.contains("checked-for-booking"))
          item.classList.remove("checked-for-booking");
      }
    }
    row.addEventListener("mousemove", onMouseMove);
    row.addEventListener("mouseleave", onMouseLeave);

    row.onmouseup = function () {
      row.removeEventListener("mousemove", onMouseMove);
      row.removeEventListener("mouseleave", onMouseLeave);
      el.onmouseup = null;
    };
  };

  onCellMouseUp = (e) => {
    let el = e.target;
    if (
      el.classList.contains("shedule__head") ||
      el.classList.contains("_room__link")
    )
      return; //выходим, если клик по заголовку
    while (!el.classList.contains("shedule__day")) {
      el = el.parentNode;
    }

    try {
      if (
        moment(this.state.firstBookingDate, "L").isSame(
          moment(el.dataset.date, "L")
        )
      ) {
        //return;
        this.unselectElements(
          el,
          moment(el.dataset.date, "L").unix(),
          moment(this.state.firstBookingDate, "L").unix()
        );
        return; //отключаем, а то слишком частые уведомления, на каждый клик
        throw new Error("даты заезда и выезда должны отличаться!");
      }
      if (this.state.bookingRoom !== el.dataset.id) {
        return;
        //throw new Error("Нужно выбрать две даты в одной строке, т.е. в одном номере!");
      }

      if (
        moment(this.state.firstBookingDate, "L").isBefore(
          moment().subtract(1, "days")
        ) ||
        moment(el.dataset.date, "L").isBefore(moment().subtract(1, "days"))
      ) {
        let date1 = moment(el.dataset.date, "L").unix();
        let date2 = moment(this.state.firstBookingDate, "L").unix();
        this.unselectElements(el, date1, date2);
        return; // выходим из функции, не бросаем ошибку, т.к. она уже была в onMouseMove,просто выходим без вызова модалки
        throw new Error("Нельзя забронировать дату в прошлом!");
      }

      if (this.state.bookingRoom === el.dataset.id) {
        let date1 = moment(el.dataset.date, "L").unix();
        let date2 = moment(this.state.firstBookingDate, "L").unix();
        let startDate =
          date1 < date2
            ? moment(el.dataset.date, "L")
            : moment(this.state.firstBookingDate, "L");
        let finishDate =
          date1 > date2
            ? moment(el.dataset.date, "L")
            : moment(this.state.firstBookingDate, "L");

        let nights = Math.floor(Math.abs(date2 - date1) / 24 / 60 / 60);
        if (this.busyInspect(el, date1, date2)) {
          this.setState({
            start: moment(startDate).format("L"),
            finish: moment(finishDate).format("L"),
            secondBookingDate: el.dataset.date,
          });
          this.showModal();
        }
      } else {
        throw new Error("Бронь невозможна");
      }
    } catch (e) {
      errorMessage(e.message, 3000, true);
    }
  };

  clearSelectedCells = () => {
    //Очистка выделенных элементов
    let coll = document.querySelectorAll(".shedule .checked-for-booking");
    for (let item of coll) {
      if (item.classList.contains("checked-for-booking"))
        item.classList.remove("checked-for-booking");
    }
  };

  // handleCancel = () => {
  //   this.hideModal();
  //   this.setState({
  //     firstBookingDate: null,
  //     secondBookingDate: null,
  //     bookingRoom: null,
  //     start: null,
  //     finish: null,
  //   });this.props.stores.orders.fetchAll();
  // };

  //handleOk = () => {
  closeModal = () => {
    this.hideModal();
    this.setState({
      firstBookingDate: null,
      secondBookingDate: null,
      bookingRoom: null,
      start: null,
      finish: null,
    });
    this.props.stores.orders.fetchAll();
  };

  busyInspect = (el, startDate, finishDate) => {
    let current, status;
    let nights = Math.floor(Math.abs(finishDate - startDate) / 24 / 60 / 60);
    if (finishDate > startDate) {
      for (
        let n = 0, current = el;
        n <= nights;
        ++n, current = current.nextSibling
      ) {
        if (current.dataset.busy) {
          status = "busy";
          break;
        }
      }
    } else {
      for (
        let n = 0, current = el;
        n <= nights;
        ++n, current = current.previousSibling
      ) {
        if (current.dataset.busy) {
          status = "busy";
          break;
        }
      }
    }
    if (status === "busy") {
      this.unselectElements(el, startDate, finishDate);
      return false; //возвращаем FALSE, чтобы вызывающий код мог проверить результат и отреагировать, вызвать, или не вызвать модалку
    }
    return true;
  };

  unselectElements = (el, startDate, finishDate) => {
    let current;
    let nights = Math.floor(Math.abs(finishDate - startDate) / 24 / 60 / 60);
    if (finishDate > startDate) {
      for (
        let n = 0, current = el;
        n <= nights;
        ++n, current = current.nextSibling
      ) {
        current.classList.remove("checked-for-booking");
      }
    } else {
      for (
        let n = 0, current = el;
        n <= nights;
        ++n, current = current.previousSibling
      ) {
        current.classList.remove("checked-for-booking");
      }
    }
  };

  render() {
    moment.locale("ru");
    let adminModel = this.props.stores.admin;
    let ordersModel = this.props.stores.orders;

    let orders = ordersModel.orderByRoom(this.props.row.id);

    let item = this.props.row;
    let calend = [];
    for (let day = 0; day < adminModel.calendarInterval; ++day) {
      let busy = false;
      let first = false;
      let last = false;
      let past = false;
      let date = adminModel.startDate;
      let reservation = null;
      let reservationLastDay = null;

      if (
        moment(date).add(day, "days").isBefore(moment().subtract(1, "days"))
      ) {
        past = true;
      }

      if (orders && Array.prototype.slice.call(orders).length) {
        let d = moment(date).add(day, "days");
        for (let order of orders) {
          if (
            moment(d).isBefore(order.start) ||
            moment(d).isSameOrAfter(order.finish)
          ) {
            //Условие, что последний день (выселение), для отображения части прямоугольника красным
            if (moment(d).isSame(moment(order.finish), "days")) {
              busy = false;
              last = true;
              reservationLastDay = order;
            } else {
              busy = false;
              if (!reservation) reservation = null;
            }
          } else {
            //Условие, что первый день (заселение), для отображения части прямоугольника красным
            if (moment(d).isSame(order.start, "days")) {
              busy = false;
              first = true;
              reservation = order;
            } else {
              busy = true;
              reservation = order;
              break;
            }
          }
        }
      }

      let cls = classNames(
        "day",
        busy ? "busy" : null,
        first ? "first" : null,
        last ? "last" : null
      );
      let cellCls = classNames("shedule__day", past ? "past" : null);
      let td =
        busy || first || last ? (
          <Popover
            content={
              <React.Fragment>
                {reservationLastDay ? (
                  <section className="reservation">
                    <p>Имя бронирующего: {reservationLastDay.name}</p>
                    <p>Гостей: {reservationLastDay.guests}</p>
                    <p>Детей: {reservationLastDay.children}</p>
                    <p>с {reservationLastDay.start}</p>
                    <p>по {reservationLastDay.finish}</p>
                    <Button
                      onClick={() => this.deleteBooking(reservationLastDay.id)}
                    >
                      Удалить бронь
                    </Button>
                  </section>
                ) : (
                  ""
                )}
                {reservation ? (
                  <section className="reservation">
                    <p>Имя бронирующего: {reservation.name}</p>
                    <p>Гостей: {reservation.guests}</p>
                    <p>Детей: {reservation.children}</p>
                    <p>с {reservation.start}</p>
                    <p>по {reservation.finish}</p>
                    <Button onClick={() => this.deleteBooking(reservation.id)}>
                      Удалить бронь
                    </Button>
                  </section>
                ) : (
                  ""
                )}
              </React.Fragment>
            }
            title={moment(date).add(day, "days").format("L")}
            trigger="click"
            data-id={item.id}
            data-date={moment(date).add(day, "days").format("L")}
            key={moment(date).add(day, "days").format("L")}
          >
            {!busy || !(first || last) ? (
              <td
                key={moment(date).add(day, "days").format("L")}
                className={cellCls}
                data-busy={busy ? "busy" : undefined}
                data-id={item.id}
                data-date={moment(date).add(day, "days").format("L")}
                onClick={this.onCellClickHandler}
                onMouseDown={this.onCellMouseDown}
                onMouseUp={this.onCellMouseUp}
              >
                <div className={cls}></div>
              </td>
            ) : (
              <td
                key={moment(date).add(day, "days").format("L")}
                className={cellCls}
                data-busy={busy ? "busy" : undefined}
                data-id={item.id}
                data-date={moment(date).add(day, "days").format("L")}
                onClick={this.onCellClickHandler}
              >
                <div className={cls}></div>
              </td>
            )}
          </Popover>
        ) : (
          <td
            key={moment(date).add(day, "days").format("L")}
            className={cellCls}
            data-id={item.id}
            data-date={moment(date).add(day, "days").format("L")}
            onMouseDown={this.onCellMouseDown}
            onMouseUp={this.onCellMouseUp}
          >
            <div className={cls}></div>
          </td>
        );

      calend.push(td);
    }

    return (
      <React.Fragment>
        <tr className="shedule__row" key={item.id}>
          <td className="shedule__head">
            <NavLink
              className="_room__link"
              to={urlBuilder("room", { id: item.typeId })}
            >
              {item.type.name}&nbsp;${item.type.price} #{item.id}
            </NavLink>
          </td>
          {calend}
        </tr>
        <Modal
          title="Бронирование"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="OK"
          cancelText="Отмена"
          afterClose={this.clearSelectedCells}
          footer={[]}
        >
          <AdminOrderForm
            room={this.state.bookingRoom}
            start={this.state.start}
            finish={this.state.finish}
            dates={[this.state.start, this.state.finish]}
            submit={this.closeModal}
            reset={this.closeModal}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
export default withStore(TableRow);
