import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import quickForm from './quick.json';
import fullForm from './full.json';
import Form from './Form';

class Quick extends Component {
  render() {
    return(<Form data={quickForm} globalClass={"quick"}></Form>)
  }
}

class Full extends Component {
  render() {
    return(<Form data={fullForm} globalClass={"full"}></Form>)
  }
}

class Homepage extends Component {
  render() {
    return(
      <main className="container homepage">
        <h1 className="pagetitle">OraTaiao's Zero Carbon Bill Submission</h1>
        <Link link="/quick" text="Make a quick 3 minute submission" />
        <Link link="/full" text="Make a full submission" last={true} />
      </main>
    )
  }
}

class Link extends Component {
  render() {
    let or = <div className="or"> - Or - </div>
    if(this.props.last === true){
      or = "";
    }
    return(
      <div>
      <a href={this.props.link}>
        <div className="link"><span>{this.props.text}</span></div>
      </a>
      {or}
      </div>
    )
  }
}

ReactDOM.render(
  <Router>
    <div>
      <Route exact={true} path="/" component={Homepage}/>
      <Route path="/quick" component={Quick}/>
      <Route path="/full" component={Full}/>
    </div>
  </Router>
, document.getElementById('root'))