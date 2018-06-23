import React, { Component } from 'react';
import './App.css';
import questionData from './questions.json';
import detailsData from './details.json';

class App extends Component {
  render() {
    return(<Form questions={questionData} details={detailsData}></Form>)
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
    let questionElems = []
    for(let i=0; i<this.props.questions.length; i++){
      if(this.props.questions[i].type === "multi")
        questionElems.push(<Multi data={this.props.questions[i]} num={i} form={this} key={i}></Multi>)
      else if(this.props.questions[i].type === "single")
        questionElems.push(<Text data={this.props.questions[i]} num={i} form={this} key={i}></Text>)
    }

    let detailsElems = []
    for(let i=0; i<this.props.details.length; i++){
      detailsElems.push(<Details data={this.props.details[i]} num={i} form={this} key={i}></Details>)
    }

    return(
      <form onSubmit={this.handleSubmit}>
        {questionElems}
        <section className="details">
          <h2>Your Details</h2>
          {detailsElems}
        </section>
        <input type="submit" value="Submit" />
      </form>
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
      <div className={data.class+" "+elems.length}>
        <label>{data.title}</label>
        {elems}
      </div>
    )
  }
}

class Question extends Component {
  constructor(props){
    super(props);
    this.props.form.addQuestions(this);
    this.response = "";
  }

  handleClick(event, object){
    this.selected = object.radioBtn;
    this.response = object.textarea.props.defaultValue;
    this.props.form.handleChange(event);
  }

  handleKeyEvent(event){
    this.response = event.target.value;
    this.props.form.handleChange(event);
  }
}

class Text extends Question {
  render(){
    if(typeof this.props.data.textbox !== "undefined")
      this.textarea = <textarea defaultValue={this.props.data.textbox} onChange={(e)=>this.handleKeyEvent(e)}></textarea>
    else
      this.textarea = <textarea defaultValue="" placeholder={this.props.data.placeholder} onChange={(e)=>this.handleKeyEvent(e)}></textarea>
    this.response = this.props.data.textbox+""
    return(
      <section className={(this.props.data.required ? "required " : " ")+this.props.data.type}>
        <h2>{this.props.data.title}</h2>
        <p>{this.props.data.description}</p>
        <div>{this.textarea}</div>
      </section>
    )
  }
}

class Multi extends Question {
  render(){
    let out = []
    for(let i=0; i<this.props.data.answers.length; i++){
      out.push(<Answer data={this.props.data.answers[i]} question={this} form={this.props.form}
        parent={this.props.num} key={this.props.num.toString()+i.toString()} iteration={i}></Answer>)
    }
    return(
      <section className={(this.props.data.required ? "required " : " ")+this.props.data.type}>
        <h2>{this.props.data.title}</h2>
        <p>{this.props.data.description}</p>
        <div>{out}</div>
      </section>
    )
  }
}

class Answer extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
    this.id = this.props.parent.toString()+this.props.iteration.toString();
    this.radioBtn = <input type="radio" name={this.props.parent} id={this.id} onChange={((e) => this.props.question.handleClick(e, this))}></input>
    if(typeof this.data.textbox !== "undefined")
      this.textarea = <textarea defaultValue={this.data.textbox} name={this.id} onChange={(e)=>this.props.question.handleKeyEvent(e)}></textarea>
    else
      this.textarea = <textarea defaultValue="" placeholder={this.data.placeholder} name={this.id} onChange={(e)=>this.props.question.handleKeyEvent(e)}></textarea>
  }

  render(){
    return(<div><label>{this.radioBtn}<span className="label-text">{this.data.option}</span></label>{this.expanded()}</div>)
  }

  expanded(){
    if(this.props.question.selected === this.radioBtn){
      return <div><p>{this.data.clicked}</p>{this.textarea}</div>;
    }
  }
}

export default App;
