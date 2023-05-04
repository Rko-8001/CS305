import { Double, ObjectId } from "mongodb";

class problem {
    // constructor
    constructor(obj) {
        this.author_handle = obj.author_handle; // string
        this.title = obj.title; // string
        this.content = obj.content; // string
        this.correct_code_CPP = obj.correct_code_CPP; // string
        this.correct_code_JAVA = obj.correct_code_JAVA; // string
        this.time_limit = new Double(obj.time_limit); // double
        this.input_format = obj.input_format; // string
        this.output_format = obj.output_format; // string
        this.example_input = obj.example_input; // string
        this.example_output = obj.example_output; // string
        this.function_def_CPP = obj.function_def_CPP; // string
        this.input_template_CPP = obj.input_template_CPP; // string
        this.function_def_JAVA = obj.function_def_JAVA // string
        this.input_template_JAVA = obj.input_template_JAVA // string
        this.testcases = obj.testcases; // string
        this.timestamp = new Date(obj.timestamp); // DATE
        this.tags = obj.tags; // array of strings
        this.level = obj.level; // easy / medium / hard 
    }
}


class blog {
    constructor(obj) {
        this.handle = obj.handle; // string
        this.type = obj.type; // string
        this.title = obj.title; // string
        this.content = obj.content; // string
        this.timestamp = new Date(obj.timestamp); // DATE
        this.links = obj.links; // array of strings
        this.comments = obj.comments; // array of comments
    }
}

class comments {
    constructor(obj)
    {
        this.handle = obj.handle;
        this.comment = obj.comment;
        this.timestamp = new Date(obj.timestamp);
    }
}

class editorial extends blog{
    constructor(obj)
    {
        super(obj);
        this.problemId = new ObjectId(obj.problemId);
        this.Cppcode = obj.CPPcode;
        this.Javacode = obj.Javacode;
        delete this.title;
    }
}
export { problem, blog,comments,editorial};
