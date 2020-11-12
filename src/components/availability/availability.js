import React, { Component } from "react";
import "antd/dist/antd.css";
import withStore from "~/hocs/withStore";
import {
  Form,
  DatePicker,
  Row,
  Col,
  Input,
  Button,
  Select,
  Slider,
  InputNumber,
} from "antd";
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
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

class Availability extends Component {
  state = {
    inputValue: 350,
  };

  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
  };

  formRef = React.createRef();

  findFreeRooms = async (interval) => {
    this.props.stores.rooms.setDates(interval);
    try {
      let a = interval[0].format("YYYY-MM-DD");
      let b = interval[1].format("YYYY-MM-DD");

      await this.props.stores.rooms.fetchAll(`?_embed=orders`); //`typeId=${id}`
      let roomForOrder = null;
      let awailableTypes = new Set();
      for (let room of this.props.stores.rooms.rooms) {
        let ok = true;
        if (Array.prototype.slice.call(room.orders).length) {
          for (let order of room.orders) {
            if (
              (moment(a).isBefore(order.start) &&
                moment(b).isSameOrBefore(order.start)) ||
              (moment(a).isSameOrAfter(order.finish) &&
                moment(b).isAfter(order.finish))
            ) {
            } else {
              ok = false;
            }
          }
        } else {
          awailableTypes.add(room.typeId);
        }
        if (ok) {
          awailableTypes.add(room.typeId);
        }
      }
      return awailableTypes;
      if (!awailableTypes.size) {
        throw new Error(
          "Увы, номера с заданными характеристиками на эти даты нет."
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  rangeChange = async (e) => {
    this.findFreeRooms(e);
  };

  onGuestsChange = async (e) => {
    this.props.stores.rooms.setGuests(e);
  };

  onChildrenChange = async (e) => {
    this.props.stores.rooms.setChildren(e);
  };

  onFinish = async (values) => {
    let children = values.children ? parseInt(values.children) : 0;
    let visitors = parseInt(values.numberGuests); // + children; ==наверное дети будут без места, поэтому не надо суммировать!!!!!!
    if (children > 1) {
      visitors += children - 1;
    }
    //let str =`?visitors_gte=${visitors}` //-----минус 1, т.к. можно взять доп. место (по одному в каждом номере)
    let str = `?visitors=${visitors}&visitors=${visitors + 1}`; //-----плюс 1, т.к. можно взять доп. место (по одному в каждом номере)

    str += `&price_lte=${values.cost}`;
    //ДОступные номера
    let types = "";
    let interval = await this.findFreeRooms(values.dateRange);
    if (interval.size === this.props.stores.types.types.length) {
    } else {
      for (let i of interval) {
        types += `&id=${i}`;
      }
    }
    str += types ? types : "";

    await this.props.stores.types.fetchAll(str);
  };

  onReset = async () => {
    await this.props.stores.types.fetchAll();
    this.formRef.current.resetFields();
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  render() {
    const { inputValue } = this.state;
    // let types = this.getTypes().map((item)=>{
    //     return (
    //         <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
    //     )
    // })
    return (
      <React.Fragment>
        <div className="search-room-container">
          <Form
            {...layout}
            ref={this.formRef}
            name="control-ref"
            initialValues={{ children: 0, cost: inputValue }}
            onFinish={this.onFinish}
          >
            <Row gutter={24}>
              <Col span={12}>
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
                    // onChange={this.onGChange}
                    allowClear
                  >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...shortLabelLayout}
                  name="cost"
                  label="Цена, $"
                  rules={[]}
                >
                  <Slider
                    min={100}
                    max={350}
                    onChange={this.onChange}
                    value={typeof inputValue === "number" ? inputValue : 350}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <b>{inputValue} $</b>
              </Col>
              <Col span={10}>
                <Form.Item
                  {...shortLabelLayout}
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
                    // defaultValue
                    onChange={this.rangeChange}
                    disabledDate={this.disabledDate}
                    initialValues={[
                      moment(new Date(), dateFormat),
                      moment(new Date(), dateFormat),
                    ]}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col
                span={24}
                style={{
                  textAlign: "center",
                }}
              >
                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Найти
                  </Button>
                  <Button htmlType="button" onClick={this.onReset}>
                    Сбросить фильтр
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
export default withStore(Availability);
