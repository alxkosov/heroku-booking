import React, { Component } from "react";
import { Carousel } from "antd";

class Apartment extends Component {
  render() {
    let type = this.props.type;

    let gallery = [];
    if (Array.isArray(type.images)) {
      gallery = type.images.map((image, i) => {
        return <img key={i} src={image} />;
      });
    }
    return (
      <React.Fragment>
        <div className="flexbox-container">
          <div className="flex-item flex-item_fixed">
            <div className="room-gallery">
              <Carousel autoplay>{gallery ? gallery : ""}</Carousel>
            </div>
          </div>
          <div className="flex-item flex-item_auto">
            <h3>{type.name}</h3>
            <div>Цена за ночь: {type.price}</div>
            <div>Мест: {type.visitors} + 1(доп.место)</div>
            <div>
              Один ребенок до 6ти лет может размещаться без места, если же детей
              больше одного, то место нужно на каждого, начиная со второго.
            </div>
            <div></div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Apartment;
