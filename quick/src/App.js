import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import './App.css';
import logo from './logo.svg';
import formData from './form.json';

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

  }

  addChangeListener(element){
    this.handleChange.bind(element);
  }

  render() {
    let header = this.props.data.header;
    let questions = this.props.data.questions;
    let footer = this.props.data.footer;

    let elems = []
    for(let i=0; i<questions.length; i++){
      if(questions[i].type === "multi")
        elems.push(<MultiQuestion data={questions[i]} num={i} form={this} key={i}></MultiQuestion>)
      else if(questions[i].type === "single")
        elems.push(<Question data={questions[i]} num={i} form={this} key={i}></Question>)
      else if(questions[i].type === "text")
        elems.push(<Text data={questions[i]} num={i} form={this} key={i}></Text>)
      else if(questions[i].type === "details")
        elems.push(<Details data={questions[i]} num={i} form={this} key={i}></Details>)
    }

    return(
      <div>
      <header className="header">
        <h1>{header.title}</h1>
        <p>{header.content}</p>
        <h2>{header.subtitle}</h2>
      </header>
      <form onSubmit={this.handleSubmit} action="/submit-quick">
        {elems}
        <section className="footer">
          <p className="disclaimer" dangerouslySetInnerHTML={{ __html: footer.text }}></p>
          <Switch data={footer.checkbox} />
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
    return (
      <div className={"details "+this.props.data.class}>
        <input type={this.props.data.input} placeholder={this.props.data.placeholder} />
        <span className="label">{this.props.data.description}</span>
      </div>
    )
  }
}

class Question extends Component {
  constructor(props){
    super(props);
    this.props.form.addQuestions(this);
    if(this.props.data.input === "simple"){
      this.textarea = <input type="text" placeholder={this.props.data.placeholder} onChange={(e)=>this.handleKeyEvent(e)}></input>
    } else if(this.props.data.input === "rich"){
      this.textarea = <p contentEditable="true" dangerouslySetInnerHTML={{ __html: this.props.data.textbox }} onChange={(e)=>this.handleKeyEvent(e)}></p>
    }
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
        <p className="title" dangerouslySetInnerHTML={{ __html: this.props.data.title }}></p>
        <p className="description" dangerouslySetInnerHTML={{ __html: this.props.data.description }}></p>
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

class Switch extends Component {
  constructor(props) {
    super(props);
    this.label = this.props.data.label;
    this.default = this.props.data.default;
    this.description = this.props.data.description;
  }

  render(){
    return (
      <label className="switch">
         <p>{this.description}</p>
         <input type="checkbox" defaultChecked={this.default} />
         <span className="slider"></span>
        <span className="label">{this.label}</span>
      </label>
    )
  }
}

class Text extends Component {
  render(){
    return (
      <p className="text-section" dangerouslySetInnerHTML={{ __html: this.props.data.text }}></p>
    )
  }
}

export default App;
