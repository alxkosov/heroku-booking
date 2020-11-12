import Home from '~p/Home';
import Rooms from '~p/Rooms';
import Room from '~p/Room';
import Shedule from '~p/shedule';

import Page404 from '~p/error404';

let routes = [
	{
        name: 'rooms',
        url: '/rooms',
        component: Rooms,
        exact: true
    },
    {
        name: 'room',
        url: '/rooms/:id',
        component: Room,
        exact: true
    },
    {
        name: 'shedule',
        url: '/shedule',
        component: Shedule,
        exact: true
    },	
    {
        name: 'home',
        url: '/',
        component: Home,
        exact: true
    },
    {
        url: '**',
        component: Page404
    }
];

let routesMap = {};

routes.forEach((route) => {
    if(route.hasOwnProperty('name')){
        routesMap[route.name] = route.url;
    }
});

let urlBuilder = function(name, params){
    if(!routesMap.hasOwnProperty(name)){
        return null;
    }

    let url = routesMap[name];

    for(let key in params){
        url = url.replace(':' + key, params[key]);
    }

    return url;
}

export default routes;
export {routesMap, urlBuilder};