import React, { Component } from 'react';
import './index.css';
import './Homepage.css';

class App extends Component {
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

export default App;