import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import ContentEditable from 'react-contenteditable';
import './index.css';
import './Quick.css';
import logo from './logo.svg';
import formData from './quick.json';

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
    this.checkbox = {};
  }

  addQuestions(question){ 
    this.questions.push(question);
  }

  addDetail(detail){
    this.details[detail.props.data.class] = detail;
  }

  addCheckbox(checkbox){
    this.checkbox = checkbox;
  }

  handleChange(event) {
    this.forceUpdate();
  }

  handleRequired(){
    let ommitted = false;
    let email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!email_regex.test(String(this.details.email.response))){
      this.details.email.triggerRequired();
      ommitted = true;
    }
    if(this.details.name.response.length===0){
      this.details.name.triggerRequired();
      ommitted = true;
    } 
    let phone_length = this.details.phone.response ? this.details.phone.response.match(/\d/g).length : 0;
    if(phone_length<8 || phone_length>12){
      this.details.phone.triggerRequired();
      ommitted = true;
    }
    return ommitted;
  }

  getElementData(){
    let toSend = {}
    let text_elems = [];
    for(let i=0; i<this.questions.length; i++){
      let out_text = "";
      let question = this.questions[i];
      let data = question.props.data;
      if(data.type === "text"){
        out_text = data.text; 
      } else if(!data.required && (question.response === "undefined" || question.response.length===0) ){
        continue;
      } else if(data.type === "details"){
        out_text = question.response;
      } else if(data.type === "single"){
        out_text = data.title+question.response;
      }
      text_elems.push(out_text);
    }
    if(this.checkbox.checked){
      text_elems.push(this.checkbox.withheld);
    }
    toSend["text"] = text_elems;
    let details_elems = {};
    for(let d in this.details){
      details_elems[d] = this.details[d].response;
    }
    toSend["details"] = details_elems;
    return toSend;
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.handleRequired()) return;

    let elementData = this.getElementData();

    fetch('http://localhost:8003/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elementData)
    }).then((response) => {
      if (response.ok) this.finished = 2;
      else this.finished = 3;
      this.forceUpdate();
    });
    this.finished = 1;
    this.forceUpdate();
  }

  addChangeListener(element){
    this.handleChange.bind(element);
  }

  render() {
    let header = this.props.data.header;
    header = (<header className="header">
      <h1>{header.title}</h1>
      <p>{header.content}</p>
      <h2>{header.subtitle}</h2>
      </header>
    )

    let questions = this.props.data.questions;
    let footer = this.props.data.footer;

    let elems = [];
    let footerElems = [];
    if(this.finished > 0){
      elems = <section className="finished" dangerouslySetInnerHTML={{ __html: this.props.data.finished[this.finished-1] }}></section>
    } else {
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
      footerElems = (
        <div>
        <hr/>
        <p className="disclaimer" dangerouslySetInnerHTML={{ __html: footer.text }}></p>
        <Switch data={footer.checkbox} form={this} />
        <input type="submit" value={footer.button} />
        </div>
      );
    }
    
    return(
      <div>
      {header}
      <form onSubmit={this.handleSubmit} id="mainForm">
        {elems}
        <section className="footer">
          {footerElems}
          <div className="logo-container">
            <a href="http://www.orataiao.org.nz/" target="_blank" rel="noopener noreferrer" title="Form By OraTaiao"
              className={"orataiao-logo"+((this.finished===1)?" rotating":"")} 
            >
              <ReactSVG path={logo} />
            </a>
          </div>
        </section>
      </form>
      </div>
    )
  }
}

class FormComponent extends Component {
  constructor(props){
    super(props);
    this.props.form.addQuestions(this);
    this.response = "";
  }

  handleKeyEvent(event){
    this.response = event.target.value;
    this.props.form.handleChange(event);
  }
}

class Details extends FormComponent {
  constructor(props){
    super(props);
    this.props.form.addDetail(this);
    this.error = false;
  }

  handleKeyEvent(event){
    this.error = false;
    super.handleKeyEvent(event);
  }

  triggerRequired(){
    this.error = true;
    this.forceUpdate();
  }

  render(){
    let errorMsg = [];
    if(this.error) errorMsg = <span className="errorMsg">{this.props.data.error}</span>;
    return (
      <div className={"details "+this.props.data.class+(this.error?" error":"")}>
        {errorMsg}
        <input type={this.props.data.input} placeholder={this.props.data.placeholder} 
           onChange={(e)=>this.handleKeyEvent(e)} />
        <span className="label">{this.props.data.description}</span>
      </div>
    )
  }
}

class Question extends FormComponent {
  constructor(props){
    super(props);
    if(this.props.data.input === "simple"){
      this.textarea = <input type="text" placeholder={this.props.data.placeholder} onChange={(e)=>this.handleKeyEvent(e)}></input>
    } else if(this.props.data.input === "rich"){
      this.textarea = <ContentEditable html={this.props.data.textbox} onChange={(e)=>this.handleKeyEvent(e)} />
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

  render(){
    return(
      <section className={this.props.data.type}>
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
    this.withheld = this.props.data.withheld;
    this.props.form.addCheckbox(this);
    this.checked = this.default;
  }

  handleChange(event){
    this.checked = event.target.checked;
    this.props.form.handleChange(event);
  }

  render(){
    return (
      <label className="switch">
         <p>{this.description}</p>
         <input type="checkbox" defaultChecked={this.default} onChange={(e)=>this.handleChange(e)} />
         <span className="slider"></span>
        <span className="label">{this.label}</span>
      </label>
    )
  }
}

class Text extends FormComponent {
  render(){
    return (
      <p className="text-section" dangerouslySetInnerHTML={{ __html: this.props.data.text }}></p>
    )
  }
}

export default App;
