import React, {Component} from 'react';
import E404 from '~c/errors/404';
import { urlBuilder } from '~/routes';
import withStore from '~/hocs/withStore';

import RoomsList from '~c/RoomsList';
import Availability from '~c/availability';
class Rooms extends Component{

  render() {  
   
    return (
      <React.Fragment>
          <Availability />
          <RoomsList /> 
      </React.Fragment>
    ) 
  }
}
export default withStore(Rooms);