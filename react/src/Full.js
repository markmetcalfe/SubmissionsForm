import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import './index.css';
import './Full.css';
import logo from './logo.svg';
import formData from './full.json';

class App extends Component {
  render() {
    return(<Form data={formData}></Form>)
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'init'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.questions = [];
    this.details = {};
  }

  addQuestions(question){ 
    this.questions.push(question);
  }

  updateDetail(event){
    this.details[event.id] = event.value;
  }

  handleChange(event) {
    this.forceUpdate();
  }

  handleSubmit(event) {
    for(let i=0; i<this.questions.length; i++){
      console.log(this.questions[i].response)
    }
    console.log(this.details)
    console.log(this.details)
    event.preventDefault();
  }

  addChangeListener(element){
    this.handleChange.bind(element);
  }

  render() {
    let header = this.props.data.header;
    let questions = this.props.data.questions;
    let details = this.props.data.details;
    let footer = this.props.data.footer;

    let questionElems = []
    for(let i=0; i<questions.length; i++){
      if(questions[i].type === "multi")
        questionElems.push(<MultiQuestion data={questions[i]} num={i} form={this} key={i}></MultiQuestion>)
      else if(questions[i].type === "single")
        questionElems.push(<Question data={questions[i]} num={i} form={this} key={i}></Question>)
    }

    let detailsElems = []
    for(let i=0; i<details.length; i++){
      detailsElems.push(<Details data={details[i]} num={i} form={this} key={i}></Details>)
    }

    return(
      <div>
      <header className="header">
        <h1>{header.title}</h1>
        <p>{header.content}</p>
      </header>
      <form onSubmit={this.handleSubmit}>
        {questionElems}
        <section className="details">
          <h2>Your Details</h2>
          {detailsElems}
        </section>
        <section className="footer">
          <p className="disclaimer">{footer.text}</p>
          <input type="submit" value={footer.button} />
          <div className="logo-container">
            <a href="http://www.orataiao.org.nz/" target="_blank" rel="noopener noreferrer" className="orataiao-logo" title="Form By OraTaiao">
              <ReactSVG path={logo} />
            </a>
          </div>
        </section>
      </form>
      </div>
    )
  }
}

class Details extends Component {
  render(){
    let data = this.props.data
    let elems = []
    for(let i=0; i<data.elements.length; i++){
      elems.push(<input type={data.elements[i].type} defaultValue={data.elements[i].value} id={data.elements[i].id}
        placeholder={data.elements[i].placeholder} key={i} onChange={(e)=>this.props.form.updateDetail(e.target)}></input>)
    }
    return (
      <div className={(this.props.data.required ? "required " : " ")+data.class+" w"+elems.length}>
        <label className="title">{data.title}</label>
        {elems}
      </div>
    )
  }
}

class Question extends Component {
  constructor(props){
    super(props);
    this.props.form.addQuestions(this);
    this.textarea = <textarea defaultValue={(typeof this.props.data.textbox !== "undefined")?this.props.data.textbox:""} 
      placeholder={(typeof this.props.data.placeholder !== "undefined")?this.props.data.placeholder:""} 
      onChange={(e)=>this.handleKeyEvent(e)}></textarea>
    this.response = this.props.data.textbox+"";
    this.options = [];
  }

  handleClick(event, object){
    this.selected = object.radioBtn;
    this.optionsText = object.expanded();
    this.response = this.textarea.value;
    this.props.form.handleChange(event);
  }

  handleKeyEvent(event){
    this.response = event.target.value;
    this.props.form.handleChange(event);
  }

  render(){
    return(
      <section className={(this.props.data.required ? "required " : " ")+this.props.data.type}>
        <h2 className="title">{this.props.data.title}</h2>
        <p className="description">{this.props.data.description}</p>
        {this.getOptions()}
        {this.optionsText}
        {this.getTextArea()}
      </section>
    )
  }

  getTextArea(){return <span>{this.textarea}</span>}
  getOptions(){}
}

class MultiQuestion extends Question {
  getOptions(){
    let out = []
    for(let i=0; i<this.props.data.options.length; i++){
      out.push(<Answer data={this.props.data} question={this} form={this.props.form}
        parent={this.props.num} key={this.props.num.toString()+i.toString()} i={i}></Answer>)
    }
    return <div className="options">{out}</div>
  }

  getTextArea(){ if(typeof this.selected !== "undefined") return <span>{this.textarea}</span>}
}

class Answer extends Component {
  constructor(props) {
    super(props);
    this.optionData = this.props.data.options[this.props.i]
    this.data = this.props.data;
    this.id = this.props.parent.toString()+this.props.i.toString();
    this.radioBtn = <input type="radio" name={this.props.parent} id={this.id} onChange={((e) => this.props.question.handleClick(e, this))}></input>
  }

  render(){
    return <label className="button">{this.radioBtn}
      <span className="custom-radio"></span>
      <span className="text">{this.optionData.option}</span>
      </label>
  }

  expanded(){
    if(this.props.question.selected === this.radioBtn){
      return <div>
        <p className="clicked">{this.optionData.clicked}</p>
        <p className="clicked-description">{this.optionData.clicked_description}</p>
      </div>
    }
  }
}

export default App;
