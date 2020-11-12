import React, { Component } from "react";
import withStore from "~/hocs/withStore";
import "antd/dist/antd.css";
import { Carousel, Form, Input, DatePicker, Button, Modal, Select } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";
const monthFormat = "MM/YYYY";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
const shortLabelLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
const footerLayout = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

class AdminOrderForm extends Component {
  //  МОДАЛЬНЫЕ ОКНА
  confirmDialog = (info, roomForOrder, order) => {
    let that = this;
    Modal.confirm({
      title: "Подтвердите бронирование",
      content: (
        <div>
          <p>Проверьте ваши данные:</p>
          <table>
            <tbody>
              <tr>
                <td>Имя заказчика:</td>
                <td>{info.name} </td>
              </tr>
              <tr>
                <td>Всего гостей:</td>
                <td>{info.guests} </td>
              </tr>
              <tr>
                <td>Детей:</td>
                <td>{info.children} </td>
              </tr>
              <tr>
                <td>Ночей:</td>
                <td>
                  <strong>{info.nights} ночей</strong> с {info.from} по{" "}
                  {info.to}
                </td>
              </tr>
              <tr>
                <td>Сумма:</td>
                <td>
                  <strong>{info.sum}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      onOk() {
        that.bookingRoom(roomForOrder, order);
        that.successDialog(info);
        that.props.submit();
      },
      onCancel() {
        that.cancelDialog();
        that.props.cancel();
      },
      okText: "ОК",
      cancelText: "Отменить",
    });
  };

  successDialog = (info) => {
    Modal.success({
      content: (
        <div>
          <p>Бронирование успешно завершено</p>
          <table>
            <tbody>
              <tr>
                <td>Имя заказчика:</td>
                <td>{info.name} </td>
              </tr>
              <tr>
                <td>Всего гостей:</td>
                <td>{info.guests} </td>
              </tr>
              <tr>
                <td>Детей:</td>
                <td>{info.children} </td>
              </tr>
              <tr>
                <td>Ночей:</td>
                <td>
                  <strong>{info.nights} ночей</strong> с {info.from} по{" "}
                  {info.to}
                </td>
              </tr>
              <tr>
                <td>Сумма:</td>
                <td>
                  <strong>{info.sum}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      okText: "ОК",
      cancelText: "Отменить",
    });
  };

  cancelDialog = () => {
    Modal.warning({
      title: "Бронирование отменено",
      content: "Бронирование отменено пользователем",
      okText: "ОК",
      cancelText: "Отменить",
    });
  };
  state = {
    errorMessage: "",
  };

  formRef = React.createRef();

  async componentDidMount() {
    let id = this.props.room;
    await this.props.stores.rooms.fetchOne(id);
    await this.props.stores.types.fetchOne(this.props.stores.rooms.room.typeId);
    this.props.stores.orders.fetchAll();
    this.props.stores.rooms.fetchAll(`?_embed=orders`);
  }

  onFinish = async (values) => {
    try {
      let a = values.dateRange[0].format("YYYY-MM-DD");
      let b = values.dateRange[1].format("YYYY-MM-DD");

      let id = this.props.room;
      let arr = await this.props.stores.rooms.fetchAll({
        _embed: "orders",
        typeId: id,
      });
      let roomForOrder = null;

      /** КОД НИЖЕ ЗАКОММЕНТИРОВАН, Т.К. НЕ НУЖЕН, ЕСЛИ МЫ БРОНИРУЕМ ИЗ АДМИНКИ, ТО НЕ СМОЖЕМ ЗАБРОНИРОВАТЬ НА ЗАНЯТЫЕ ДАТЫ  */
      // for (let room of this.props.stores.rooms.rooms) {
      //   if (Array.prototype.slice.call(room.orders).length) {
      //     let ok;
      //     for (let order of room.orders) {
      //       if (
      //         (moment(a).isBefore(order.start) &&
      //           moment(b).isSameOrBefore(order.start)) ||
      //         (moment(a).isSameOrAfter(order.finish) &&
      //           moment(b).isAfter(order.finish))
      //       ) {
      //         ok = true;
      //       } else {
      //         ok = false;
      //         break;
      //       }
      //     }
      //     if (ok) {
      //       roomForOrder = room;
      //       break;
      //     }
      //   } else {
      //     roomForOrder = room;
      //     break;
      //   }
      // }
      // if (!roomForOrder) {
      //   throw new Error(
      //     "Увы, номера с заданными характеристиками на эти даты нет."
      //   );
      // }
      //Если номер есть, готовим объект для брони:
      let nights = Math.floor(
        (values.dateRange[1].unix() - values.dateRange[0].unix()) / 24 / 60 / 60
      );
      let info = {
        name: values.name,
        guests: +values.numberGuests,
        children: +values.children,
        nights: nights,
        from: values.dateRange[0].format("YYYY-MM-DD"),
        to: values.dateRange[1].format("YYYY-MM-DD"),
        sum: this.calcSum(),
      };
      let order = {
        roomId: id,
        name: values.name,
        guests: +values.numberGuests,
        children: +values.children,
        start: values.dateRange[0].format("YYYY-MM-DD"),
        finish: values.dateRange[1].format("YYYY-MM-DD"),
        sum: this.calcSum(),
      };
      this.confirmDialog(info, roomForOrder, order);
    } catch (e) {
      this.setState({ errorMessage: e.message });
    }
  };

  bookingRoom = async (roomForOrder, order) => {
    // бронируем номер
    await this.props.stores.orders.add(order);
    //очищаем данные в модели и в полях формы
    await this.props.stores.rooms.setGuests();
    await this.props.stores.rooms.setChildren();
    await this.props.stores.orders.fetchAll(); // обновляем информацию в таблице
    this.props.stores.rooms.clearDates();
    this.formRef.current.resetFields();
  };

  onReset = async () => {
    await this.props.stores.rooms.setGuests();
    await this.props.stores.rooms.setChildren();
    this.formRef.current.resetFields();
    this.props.reset();
  };

  rangeChange = (value) => {
    this.setState({ errorMessage: undefined });
    this.props.stores.rooms.setDates(value);
  };

  onGuestsChange = async (e) => {
    this.props.stores.rooms.setGuests(e);
  };

  onChildrenChange = async (e) => {
    this.props.stores.rooms.setChildren(e);
  };

  calcSum = () => {
    let sumPerDay = this.props.stores.types.type.price;

    let roomsModel = this.props.stores.rooms;
    let children = roomsModel.children ? roomsModel.children : 0;
    let visitors = roomsModel.numberGuests;
    if (children > 1) {
      visitors += children - 1;
    }
    if (sumPerDay && this.props.start && this.props.finish) {
      return (
        sumPerDay *
          Math.floor(
            (moment(this.props.finish, "DD.MM.YYYY").unix() -
              moment(this.props.start, "DD.MM.YYYY").unix()) /
              24 /
              60 /
              60
          ) +
        "$"
      );
    } else {
      return "—";
    }
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  render() {
    moment.locale("ru");
    return (
      <React.Fragment>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={{
            dateRange: [
              moment(this.props.start, "DD.MM.YYYY"),
              moment(this.props.finish, "DD.MM.YYYY"),
            ],
            numberGuests: this.props.stores.rooms.numberGuests
              ? this.props.stores.rooms.numberGuests
              : 1,
            children: this.props.stores.rooms.children
              ? this.props.stores.rooms.children
              : 0,
          }}
        >
          <Form.Item
            name="name"
            label="Имя заказчика"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите имя заказчика",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="numberGuests"
            label="Количество гостей"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите количество гостей",
              },
            ]}
          >
            <Select
              onChange={this.onGuestsChange}
              placeholder="Выберите количество гостей"
              allowClear
            >
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="children"
            label="Количество детей до 6 лет"
            rules={[]}
          >
            <Select
              onChange={this.onChildrenChange}
              placeholder="Выберите количество детей"
              allowClear
            >
              <Select.Option value="0">0</Select.Option>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            {...layout}
            name="dateRange"
            label="Даты заезда/выезда"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите даты заезда и выезда",
              },
            ]}
          >
            <RangePicker
              onChange={this.rangeChange}
              format={dateFormat}
              disabledDate={this.disabledDate}
            />
          </Form.Item>
          {this.state.errorMessage ? (
            <div
              className="error"
              style={{
                margin: "10px auto",
                color: "red",
                border: "1px solid red",
                background: "#fdd",
                textAlign: "center",
              }}
            >
              {this.state.errorMessage}
            </div>
          ) : (
            ""
          )}
          <hr />
          <div style={{ textAlign: "center" }}>
            Общая сумма: <strong>{this.calcSum()}</strong>
          </div>
          <hr />
          <Form.Item {...footerLayout}>
            <Button type="primary" htmlType="submit">
              Забронировать
            </Button>
            <Button htmlType="button" onClick={this.onReset}>
              Сбросить
            </Button>
          </Form.Item>{" "}
          {/* */}
        </Form>
      </React.Fragment>
    );
  }
}

export default withStore(AdminOrderForm);
