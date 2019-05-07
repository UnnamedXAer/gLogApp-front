import { isCorrectDate, isDob, trim } from './utility';


export default class Validator {
    constructor(feed) {
        this.fields = {};
        this.rules = { // returned true if value is OK.
            required: {
                message: "The :attribute is required.",
                test: val => trim(val) !== "",
            },
            num: {
                message: "The :attribute is not a numeric value",
                test: val => this.testRegex(val, /^(\d+.?\d*)?$/)
            },
            email: {
                message: 'The :attribute must be a valid email address.',
                test: (val) => {
                    return new RegExp(/^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i).test(val);
                }
            },
            alpha_num: {
                message: 'The :attribute may only contain letters and numbers.',
                test: (val) => {
                    return new RegExp(/^[A-Z0-9]*$/i).test(val);
                }
            },
            alpha_num_space: {
                message: 'The :attribute may only contain letters, numbers and spaces.',
                test: (val) => {
                    return new RegExp(/^[A-Z0-9\s+]*$/i).test(val);
                }
            },
            yt: {
                message: '\':value\' is not a valid youtube video link.',
                test: (val) => {
                    return ((val.indexOf('https://www.youtube.com/') === 0 || val.indexOf('https://youtu.be/') === 0) 
                        && (val.length > ('https://youtu.be/').length || val.length > ('https://www.youtube.com/').length));
                }
            },
            min: {
                message: 'The :attribute must be :param+ chars long.',
                test: (val, param) => {
                    return val.length >= param;
                }
            },
            max: {
                message: 'The :attribute must be max :param chars long.',
                test: (val, param) => {
                    return val.length <= param;
                }
            },
            password: {
                message: "The :attribute must contain number and uppercase and lowercase letter.",
                test: (val, param) => {
                    return new RegExp(/*/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/*/ param).test(val);
                }
            },
            passwordConfirmation: {  // name the rule
                message: 'The passwords do not match.',
                test: (val, param) => {
                    const password = (typeof param == 'function' ? param() : param );  // function that return password
                    return val === password;
                }
            },
            formatDate: {
                message: ":attribute must be a valid date.",
                test: (val) => {
                    return isCorrectDate(val);
                }
            },
            dob: {
                message: "The date is not a valid date of birth.",
                test: (val) => {
                    return isDob(val);
                }
            },
            fileSize: {
                message: 'File size limit is :paramMB.',
                test: (val, param) => {
                    return val.size < (param * 1024 * 1024);
                }
            },
            image: {
                message: 'File type can be only png, jpg or gif.',
                test: (val) => {
                    return ['image/gif', 'image/jpeg', 'image/png'].indexOf(val.type) !== -1;
                }
            },
            notAllowed: {
                message: 'Value :value not allowed',
                test: (val, param) => {
                    return param.indexOf(val) === -1;
                }
            },
            allowed: {
                message: 'Value :value not allowed',
                test: (val, param) => {
                    return param.indexOf(val) !== -1;
                }
            }
        }
        this.registerFields(feed);
    }

    registerFields = (fieldsArr) => {
        fieldsArr.forEach(field => this.setField(field));
    }

    setField = (field) => {
        const isRequired = (field.rules.indexOf('required') > -1)
        this.fields[field.name] = {
            rules: field.rules,   // :[]rule
            required: isRequired,
            params: field.params ? field.params : {},
            errors: [], // :[]String
            edited: false,
            passed: !isRequired,//((isRequired) ? false : true),
            customError: "" // :String
        }
    }

    addCustomRule = (rule) => {
        if (typeof rule !== 'object') {
            console.error('Given argument is not object.');
        }
        if (typeof rule.message !== 'string') {
            console.error('Given rule message is not string.');
        }
        if (typeof rule.test !== 'function') {
            console.error('Given rule test is not function.');
        }
    }


    setEdited = (name) => {
        this.fields[name].edited = true;
    }

    setRules = (fieldName, ruleNames) => {
        for (let i = 0; i < ruleNames.length; i++){
            this.fields[fieldName].rules.push(ruleNames[i]);
        }
    }

    addCustomError = (fieldName, message) => {
        this.fields[fieldName].passed = false;
        return this.fields[fieldName].customError = (message);
    }

    removeCustomError = (fieldName) => {
        this.fields[fieldName].customError = "";
    }

    getMessages = (name) => {
        if (!this.fields[name]) 
            return [];
        if (this.fields[name].customError)
            return [this.fields[name].customError, ...this.fields[name].errors];
        
        return this.fields[name].errors;
    }

    validateField = (name, val) => {
        let fieldValid = true;
        const field = this.fields[name];
        if (!field) { // field not to be validated
            return;
        }
        else if (field.rules.length === 0) {
            console.error('Validation set but rules array for ' + name + ' is empty');
            fieldValid = false;
        }
        else {
            field.customError = "";
            field.errors = [];

            if (!field.required && !val) {
                fieldValid = true;
            }
            else {
                const fieldRules = field.rules;
                field.edited = true;
                for (let i = 0; i < fieldRules.length; i++) {
                    const ruleName = fieldRules[i];
                    let rule = this.rules[ruleName];
                    const ruleParam = field.params[ruleName];
                    let passed = rule.test(val, ruleParam);
                    if (!passed) {
                        let message = rule.message;
                        message = message.replace(':attribute', name);
                        message = message.replace(':value', val);
                        if (ruleParam) {
                            message = message.replace(':param', ruleParam);
                        }
                        field.errors.push(message);
                        fieldValid = false;
                        break;
                    }
                }
            }
        }
        field.passed = fieldValid;
        return fieldValid;
    }

    validateAll = (state) => {
        const keys = Object.keys(this.fields);
        keys.forEach(key => {
            this.validateField(key, state[key]);
        });
    }

    allValid = () => { 
        // this.validateAll();
        const fields = this.fields;     
        const keys = Object.keys(fields)
        let passed = true;
        keys.forEach(key => {
            if (!fields[key].passed) {
                passed = false;
            }
        });

        return passed;
    }
} 