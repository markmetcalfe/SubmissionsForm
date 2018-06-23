'use strict';

class Question {
    constructor(title, description, required) {
        this.title = title;
        this.description = description;
        this.required = required === true;
    }
}

class YesNoQuestion extends Question {
    constructor(title, description, required, yesQuestion, noQuestion) {
        super(title, description, required);
        this.yesQuestion = yesQuestion;
        this.noQuestion = noQuestion;
    }
}