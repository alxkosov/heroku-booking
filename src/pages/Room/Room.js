import React, { Component } from "react";
import E404 from "~c/errors/404";
import { urlBuilder } from "~/routes";
import withStore from "~/hocs/withStore";

import { Empty, Spin } from "antd";

import RoomsList from "~c/RoomsList";
import Apartment from "~c/apartment";
import OrderForm from "~c/orderForm";

// import "antd/dist/antd.css";
// import { Carousel, Form, Input, DatePicker, Button, Modal, Select } from "antd"; //, Select, Slider, InputNumber, Row, Col, Input,
// import moment from "moment";

// const { RangePicker } = DatePicker;

// const dateFormat = "DD/MM/YYYY";
// const monthFormat = "MM/YYYY";

// const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

// const layout = {
//   labelCol: {
//     span: 8,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
// const shortLabelLayout = {
//   labelCol: { span: 12 },
//   wrapperCol: { span: 12 },
// };
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 8,
//   },
// };

//----------------------------------------------------------
class Room extends Component {
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.stores.types.fetchOne(id);
    //this.props.stores.rooms.fetchAll();
  }

  render() {
    let typesModel = this.props.stores.types;
    //let roomModel = this.props.stores.rooms;
    let gallery = [];
    if (Array.isArray(typesModel.type.images)) {
      gallery = typesModel.type.images.map((image, i) => {
        return <img key={i} src={image} />;
      });
    }
    return (
      <React.Fragment>
        {typesModel.stateOne == "empty" ? (
          <div className="centered">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : typesModel.stateOne == "done" ? (
          <Apartment type={typesModel.type} />
        ) : typesModel.stateOne == "pending" ? (
          <div className="centered mh100">
            <Spin />
          </div>
        ) : (
          <E404 />
        )}
        <hr />
        <h4>Бронирование</h4>
        <OrderForm roomId={this.props.match.params.id} />
      </React.Fragment>
    );
  }
}
export default withStore(Room);
