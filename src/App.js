import React, { Component } from 'react';
import './App.css';
import formData from './questions.json';

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
  }

  addQuestions(question){ 
    this.questions.push(question);
  }

  handleChange(event) {
    //console.log(this.questions[0].response)
    this.forceUpdate();
  }

  handleSubmit(event) {
    for(let i=0; i<this.questions.length; i++){
      console.log(this.questions[i].response)
    }
    event.preventDefault();
  }

  addChangeListener(element){
    this.handleChange.bind(element);
  }

  render() {
    let out = []
    for(let i=0; i<this.props.data.length; i++){
      out.push(<Question question={this.props.data[i]} num={i} form={this}></Question>)
    }
    return(
      <form onSubmit={this.handleSubmit}>
        {out}
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class Question extends Component {
  constructor(props){
    super(props);
    this.props.form.addQuestions(this);
    this.response = "";
  }

  render(){
    let out = []
    for(let i=0; i<this.props.question.answers.length; i++){
      out.push(<Answer data={this.props.question.answers[i]} parent={this.props.num} question={this} iteration={i} form={this.props.form}></Answer>)
    }
    return(
      <section className={this.props.question.required ? "required" : ""}>
        <h2>{this.props.question.title}</h2>
        <p>{this.props.question.description}</p>
        <div>{out}</div>
      </section>
    )
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

  isSelected(answer){
    return this.selected === answer;
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
    return(<div><label>{this.radioBtn}<span className="label-text">{this.data.option}</span></label>{this.render_expanded()}</div>)
  }

  render_expanded(){
    if(this.props.question.isSelected(this.radioBtn)){
      return <div><p>{this.data.clicked}</p>{this.textarea}</div>;
    }
  }
}

export default App;
