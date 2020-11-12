import React from 'react';
import ReactDom from 'react-dom';
import App from './app';

import 'bootstrap/dist/css/bootstrap.min.css';

import {Provider} from 'mobx-react';
import stores from '~s';

// stores.articles.all().then(() => {
    // ReactDom.render(<Provider stores={stores}>
        // <App/>
    // </Provider>, document.querySelector('#app'));
// });
ReactDom.render(<Provider stores={stores}>
         <App/>
     </Provider>, document.querySelector('#app'));



