class problem {
    constructor(obj) {
        this.author_email = obj.author_email; // string
        this.title = obj.title; // string
        this.content = obj.content; // string
        this.correct_code = obj.correct_code; // string
        this.time_limit = obj.time_limit; // int
        this.memory_limit = obj.memory_limit; // int
        this.input_format = obj.input_format; // string
        this.output_format = obj.output_format; // string
        this.sample_input = obj.sample_input; // string
        this.sample_output = obj.sample_output; // string
        this.test_cases_input = obj.test_cases_input; // string
        this.test_cases_output = obj.test_cases_output; // string
        this.timestamp = obj.timestamp;
        this.status = "pending"
    }
}

export default problem;