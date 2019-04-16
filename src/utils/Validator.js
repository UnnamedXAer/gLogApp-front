import { isCorrectDate, isDob, trim } from './utility';


export default class Validator {
    constructor(feed) {
        this.fields = {};
        this.rules = {
            required: {
                message: "The :attribute is required.",
                test: val => trim(val) !== "",
            },
            isNum: {
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
            min: {
                message: 'The :attribute must be :value+ chars long.',
                test: (val, param) => {
                  return val.length > param;
                }
            },
            max: {
                message: 'The :attribute must be can be max :param chars long.',
                test: (val, param) => {
                  return val.length > param;
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
                    console.log(param)
                    return val === param; 
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
            isImage: {
                message: 'File type can be only png, jpg or gif.',
                test: (val) => {
                    return val.type === 'image/png' || val.type === 'image/jpeg' || val.type === 'image/gif';
                }
            }
        }
        this.registerFields(feed);
    }

    registerFields = (fieldsArr) => {
        fieldsArr.forEach(field => this.setField(field));
    }

    setField = (field) => {
        this.fields[field.name] = {
            rules: field.rules,   // :[]rule
            required: (field.rules.indexOf('required') > -1),
            params: field.params ? field.params : {},
            errors: [], // :[]String
            edited: false,
            passed: true,
            customErrors: [] // :[]String
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
        this.fields[fieldName].customErrors.push(message);
    }

    removeCustomError = (fieldName, message) => {
        const index = this.fields[fieldName].customErrors.indexOf(message);
        if (index > -1) {
            this.fields[fieldName].customErrors.splice(index, 1);
        }
    }

    getMessages = (name) => {
        let messages = [];
        
        messages = messages.concat(this.fields[name].customErrors);
        messages = messages.concat(this.fields[name].errors);
        // for(let i = 0; i < this.fields[name].customErrors.length; i++) {
        //     messages.push()
        // }

        return messages;
    }

    validateField = (name, val) => {
        const field = this.fields[name];
        if (field.rules.length === 0) {
            console.error('No rules for: ', name);
            return false;
        }

        if (!field.required && val === "") {
            field.errors = [];
            return true;
        }

        const fieldRules = field.rules;
        field.errors = [];
        field.edited = true;
        for (let i = 0; i < fieldRules.length; i++) {
            const ruleName = fieldRules[i];
            let rule = this.rules[ruleName];
            const ruleParam = field.params[ruleName];
            let passed = rule.test(val, ruleParam);
            if (!passed) {
                field.passed = false;
                let message = rule.message;
                message.replace(':attribute', name);
                if (ruleParam) {
                    message.replace(':param', ruleParam);
                }
                field.errors.push(message);
                return false;
            }
        }
        return true;
    }

    validateAll = (state) => {
        
        for (let i = this.fields.length -1; i >= 0; i--) {
            this.validateField(this.fields[i].name, state[this.field.name]);
        }
    }

    allValid = () => {
        for (let i = this.fields.length -1; i >= 0; i--) {
            if (!this.fields[i]) {
                return false;
            }
        }
        return true;
    }
} 