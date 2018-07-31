import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSVG from 'react-svg';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import quickForm from './quick.json';
import fullForm from './full.json';
import Form from './Form';
import Info from './Info';
import questionCircle from './question-circle.svg';
import Popup from 'react-popup';

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
      <div>
      <main className="container homepage">
        <h1 className="pagetitle">Zero Carbon Bill Submission</h1>
        <Link link="/quick" text="Make a quick 5 minute submission" />
        <Link link="/full" text="Make a full submission" last={true} />
      </main>
      <InfoButton link="/info" />
      </div>
    )
  }
}

class InfoButton extends Component {
  render(){
    return(
      <a href={this.props.link} className="info-button">
        <ReactSVG path={questionCircle} />
      </a>
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
  <div>
  <Popup />
  <Router>
    <div>
      <Route exact={true} path="/" component={Homepage}/>
      <Route path="/quick" component={Quick}/>
      <Route path="/full" component={Full}/>
      <Route path="/info" component={Info}/>
    </div>
  </Router>
  </div>
, document.getElementById('root'))

Popup.alert(<div><h3>SUBMISSIONS CLOSED</h3><p>Please note that submissions closed on the 19th of July.</p><p>If you send a submission using this form, it will NOT be sent to MfE!</p><p>This is for demo purposes only.</p></div>);