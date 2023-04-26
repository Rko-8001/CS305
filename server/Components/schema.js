class problem {
    constructor(obj) {
        this.author_email = obj.author_email; // string
        this.title = obj.title; // string
        this.content = obj.content; // string
        this.correct_code_CPP = obj.correct_code_CPP; // string
        this.correct_code_JAVA = obj.correct_code_JAVA; // string
        this.time_limit = obj.time_limit; // double
        this.input_format = obj.input_format; // string
        this.output_format = obj.output_format; // string
        this.example_input = obj.sample_input; // string
        this.example_output = obj.sample_output; // string
        this.function_def_CPP = obj.function_def_CPP; // string
        this.input_template_CPP = obj.input_template_CPP; // string
        this.function_def_JAVA = obj.function_def_JAVA // string
        this.input_template_JAVA = obj.input_template_JAVA // string
        this.testcases = obj.test_cases_input; // string
        this.timestamp = obj.timestamp; // DATE
        this.language = obj.language; // string
        this.tags = obj.tags; // array of strings
        this.level = obj.level; // easy / medium / hard 
        this.status = "pending"
    }
}


class blog {
    constructor(obj) {
        this.handle = obj.handle; // string
        this.type = obj.type; // string
        this.title = obj.title; // string
        this.content = obj.content; // html string
        this.timestamp = obj.timestamp; // DATE
        this.links = obj.links; // array of strings
        this.comments = obj.comments; // array of comments
    }
}

class comments {
    constructor(obj)
    {
        this.handle = obj.handle;
        this.comment = obj.comment;
        this.timestamp = obj.timestamp;
    }
}

export { problem, blog};