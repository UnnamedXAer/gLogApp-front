import { isCorrectDate, isDob, trim } from './utility';


export class Validator {
    constructor() {
        this.fields = {};
        this.rules = {
            required: {
                message: ":attribute is required.",
                test: val => typeof val !== 'undefied' && trim(val) !== "",
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
                test: (val) => {
                  return val.length > 1;
                }
            },
            min: {
                message: 'The :attribute must be can be max :value chars long.',
                test: (val) => {
                  return val.length > 1;
                }
            },
            password: {
                message: "Password must be 6+ chars long, contain number and uppercase and lowercase letter.",
                test: (val) => {
                    return (new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)).test(val);
                }
            },
            passwordConfirmation: {  // name the rule
                message: 'The passwords do not match.',
                test: (val) => {
                    return val[0] === val[1];
                }
            },
            formatDate: {
                message: ":attribute must be a valid date.",
                test: (val) => {
                    return isCorrectDate(val);
                }
            },
            dob: {
                message: "Not a valid date of birth.",
                test: (val) => {
                    return isDob(val);
                }
            },
            fileSize: {
                message: 'File size limit is 2MB.',
                test: (val) => {
                    return val.size < (2 * 1024 * 1024);
                }
            },
            fileType: {
                message: 'File type can be only png, jpg or gif.',
                test: (val) => {
                    return val.type === 'image/png' || val.type === 'image/jpeg' || val.type === 'image/gif';
                }
            }
        }
    }

    setField = (name) => {
        this.fields[name] = {
            rules: [],   // :[]rule
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

    setRules = (fieldName, [ruleNames]) => {
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
        
        messages.concat(this.fields[name].customErrors);
        messages.concat(this.fields[name].errors);
        // for(let i = 0; i < this.fields[name].customErrors.length; i++) {
        //     messages.push()
        // }

        return messages;
    }

    validateField = (field, val) => {
        //const field = this.fields[name];
        if (field.rules.length === 0) {
            console.error('No rules for: ', field.name);
            return;
        }

        const fieldRules = field.rules;

        for(let i = 0; i < fieldRules.length; i++) {
            let rule = this.rules[fieldRules[i]]
            let passed = rule.test(val);
            if (!passed) {
                field.passed = false;
                let message = rule.message;
                field.errors.push(message.replace(':attribute', field.name));
                return false;
            }
        }
        return true;
    }

    validate = (state) => {
        
        for (let i = this.fields.length -1; i >= 0; i--) {
            this.validateField(this.fields[i], state[this.field.name]);
        }
    }

    isValid = () => {
        for (let i = this.fields.length -1; i >= 0; i--) {
            if (!this.fields[i]) {
                return false;
            }
        }
        return true;
    };
} 