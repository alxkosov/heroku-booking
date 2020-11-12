import React, {Component} from 'react';
import E404 from '~c/errors/404';
import withStore from '~/hocs/withStore';
import { Link} from 'react-router-dom';
import routes, { urlBuilder, routesMap } from '~/routes';
import './home.css';
import 'antd/dist/antd.css';
import { Carousel } from 'antd';

import RoomsList from '~c/RoomsList';
import Availability from '~c/availability';

class Home extends Component{

    render() {  

      return (
        <React.Fragment>
            <section className="main-content">
              <Carousel autoplay>
                <div>
                  <img src="/assets/images/carousel/01.jpg" />
                </div>
                <div>
                  <img src="/assets/images/carousel/02.jpg" />
                </div>
                <div>
                <img src="/assets/images/carousel/03.jpg" />
                </div>
                <div>
                <img src="/assets/images/carousel/04.jpg" />
                </div>
                <div>
                  <img src="/assets/images/carousel/05.jpg" />
                </div>
              </Carousel>
              <div className="">
              
              
                  <h4>Описание</h4>
                  <p>Отель «Умка Resort» расположен всего в 50 метрах от побережья Баренцева моря. К услугам гостей номера с телевизором с плоским экраном и бесплатным Wi-Fi.</p>
                  <p>Гостям «Умка Resort» предлагаются современно оформленные номера с системой вентиляции и обогрева, рабочим столом и собственной ванной комнатой.</p>
                  <p>В ресторане «Умка Resort» подают блюда азиатской, европейской и эскимосской кухни. В стильном баре с большими, удобными диванами представлен широкий выбор алкогольных и безалкогольных напитков.</p>
                  <p>На территории спа-отеля «Умка Resort» работает оздоровительной центр с крытым бассейном, русской баней и финской сауной. Помимо этого, в распоряжении гостей караоке-зал, бильярдная, боулинг, карты и домино.</p>
                  <p>Гости могут посетить развлекательный комплекс с игровыми автоматами и игровой площадкой, где также проводятся анимационные программы для детей. В спа-отеле организован прокат спортивного снаряжения.</p>
                {/* <div className="">
                  <h4>Номерной фонд</h4>
                  <RoomsList />
                </div> */}
              </div>
              <div className="">
                <Availability />
                <RoomsList /> 
              </div>  
            </section>
        </React.Fragment>
      ) 
  }
}
export default withStore(Home);