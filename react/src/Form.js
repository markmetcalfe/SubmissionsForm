import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import ContentEditable from 'react-contenteditable';
import logo from './logo.svg';
import submit_messages from './submit_messages.json';

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
    if(!email_regex.test(String(this.details.email.response)) || this.details.email.response.length>100){
      this.details.email.triggerRequired();
      ommitted = true;
    }
    if(this.details.name.response.length===0 || this.details.name.response.length>100){
      this.details.name.triggerRequired();
      ommitted = true;
    } 
    let phone_length = 0;
    if(this.details.phone.response.match(/\d/g) != null)
      phone_length = this.details.phone.response.match(/\d/g).length;
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
        out_text = "<span class=\""+data.class+"\">"+question.response+"</span>";
      } else if(data.type === "single" || data.type === "multi"){
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
    toSend["type"] = this.props.globalClass;
    return toSend;
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.handleRequired()) return;

    let elementData = this.getElementData();

    fetch('/submit/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elementData)
    }).then((response) => {
      if (!response.ok) this.finished = 2;
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
      elems = <section className="finished" dangerouslySetInnerHTML={{ __html: submit_messages[this.finished-1] }}></section>
    } else {
      for(let i=0; i<questions.length; i++){
        if(questions[i].type === "multi")
          elems.push(<MultiQuestion data={questions[i]} num={i} form={this} key={i}></MultiQuestion>)
        else if(questions[i].type === "single")
          elems.push(<SingleQuestion data={questions[i]} num={i} form={this} key={i}></SingleQuestion>)
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
      <form onSubmit={this.handleSubmit} id="mainForm" className={this.props.globalClass}>
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
    if(this.props.data.after_text && this.response.length>0) 
      this.response += this.props.data.after_text;
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
  render(){
    return(
      <section className={this.props.data.type}>
        <p className="title" dangerouslySetInnerHTML={{ __html: this.props.data.title }}></p>
        {this.getTextBox()}
      </section>
    )
  }

  getTextBox(){};
}

class SingleQuestion extends Question {
  constructor(props){
    super(props);
    if(this.props.data.input === "simple"){
      this.textarea = <input type="text" placeholder={this.props.data.placeholder} onChange={(e)=>this.handleKeyEvent(e)}></input>
    } else if(this.props.data.input === "rich"){
      this.textarea = <ContentEditable html={this.props.data.textbox} onChange={(e)=>this.handleKeyEvent(e)} />
    }
    this.response = this.props.data.textbox+"";
  }

  getTextBox(){
    return(
      <div className="textbox-single">
        <p className="description" dangerouslySetInnerHTML={{ __html: this.props.data.description }}></p>
        {this.textarea}
      </div>
    )
  }
}

class MultiQuestion extends Question {
  constructor(props){
    super(props);
    this.textboxData = this.props.data.textboxes;
    this.textboxes = [];
    this.responses = [];
    for(let i=0; i<this.textboxData.length; i++){
      if(this.textboxData[i].input === "simple"){
        this.textboxes.push(<input type="text" placeholder={this.textboxData[i].placeholder} onChange={(e)=>this.handleKeyEvent(e,i)} key={i}></input>)
      } else if(this.textboxData[i].input === "rich"){
        this.textboxes.push(<ContentEditable html={this.textboxData[i].text} onChange={(e)=>this.handleKeyEvent(e,i)} key={i} />)
      }
      this.responses.push(this.textboxData[i].text);
    }
    this.response = this.getResponse(this.responses);
  }
  
  getTextBox(){
    let elems = [];
    for(let i=0; i<this.textboxes.length; i++){
      elems.push(
        <div className="textbox-multi" key={i}>
          <p className="description" dangerouslySetInnerHTML={{ __html: this.textboxData[i].description }}></p>
          {this.textboxes[i]}
        </div>
      );
    }
    return(<span>{elems}</span>)
  }

  handleKeyEvent(event, num){
    this.responses[num] = event.target.value;
    this.response = this.getResponse(this.responses);
    this.props.form.handleChange(event);
  }

  getResponse(responses){
    let response = "";
    for(let i=0; i<responses.length; i++){
      response += responses[i];
      if(this.textboxData[i].after_text && responses[i].length>0)
        response += this.textboxData[i].after_text;
      else if(i<responses.length-1) response += " ";
    }
    return response;
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

export default Form;
