import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import Homepage from './Homepage';
import Quick from './Quick';
import Full from './Full';

ReactDOM.render(
  <Router>
    <div>
      <Route exact={true} path="/" component={Homepage}/>
      <Route path="/quick" component={Quick}/>
      <Route path="/full" component={Full}/>
    </div>
  </Router>
, document.getElementById('root'))
