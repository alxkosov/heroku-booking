import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import withStore from '~/hocs/withStore';
import { urlBuilder } from '~/routes';
//import routes, { urlBuilder, routesMap } from '~/routes';

class RoomsList extends Component{
        
    componentDidMount() {
        this.props.stores.types.fetchAll();
    }

    render(){
        let typesModel = this.props.stores.types;  
        let types = typesModel.types.map((item)=>{
        return (
            <div key={item.id} className="room">
                <div className="room__image">
                    {item.images? <img src={item.images[0]} />:<img src="/assets/images/default.jpg"/>}
                    
                </div>
                <div className="room__title">{item.name}</div>
                <div className="room__price">${item.price}</div>
                <NavLink className="room__link" to={urlBuilder('room', {id: item.id})} activeClassName="active">
                    Забронировать
                </NavLink>
            </div>
        )
        });
        return (
            <div className="rooms-container">
                {types}  
            </div>  
        )
    }

}

export default withStore(RoomsList);