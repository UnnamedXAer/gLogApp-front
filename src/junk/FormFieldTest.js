import React from 'react';
import classes from './FormField.module.css';


const formFieldTest = props => {

    let content = null;
    let errors = [];
    if (props.validator) {
        errors = props.validator.getMessages(props.name);
    }

    const errorsElement = <span className={classes.Error}>
        {errors && errors.length > 0 ? (
            <ul>
                {errors.map((err, index) => <li key={index}>{err}</li>)}  
            </ul>
        ) : null}
    </span>

    switch (props.type) {
        case 'textarea':
            content = (
                <label className={classes.FormField}>{props.label}
                    <textarea 
                        className={classes.Textarea}
                        cols={props.cols}
                        rows={props.rows}
                        name={props.name}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.changed}
                        onBlur={props.blurred}
                        required={props.required}
                        pattern={props.pattern}
                        onFocus={props.focused} />
                    {errorsElement}
                </label>
            );
            break;
        case 'selectbox':
            content = (
                <label className={classes.FormField}>{props.label}
                    <select 
                        className={classes.Select}
                        name={props.name}
                        value={props.value}
                        onChange={props.changed}
                        onBlur={props.blurred}
                        disabled={props.disabled}
                        required={props.required}
                        onFocus={props.focused} >
                        {props.options.map(x => <option key={x.value} value={x.value}>{x.text}</option>)}
                    </select>
                    {errorsElement}
                </label>          
            );
            break;
        case 'file': 
            content = (
                <label className={classes.FormField}>{props.label}
                    <input 
                        className={classes.Input}
                        type={props.type}
                        name={props.name}
                        placeholder={props.placeholder}
                        // value={props.value}
                        onChange={props.changed}
                        onBlur={props.blurred}
                        disabled={props.disabled}
                        required={props.required}
                        onFocus={props.focused} />
                    {errorsElement}
                    <img className={classes.ImgPreview} src={require("../img/avatar-blank.png")} ref={props.imgPreviewRef} alt="Avatar" />
                </label>
            );
            break;
        case 'button': 
            content = (
                <div className={classes.FormField}>
                    <button 
                        className={classes.Button}
                        disabled={props.disabled}
                        onClick={props.clicked} >
                        {props.name}</button>
                </div>
            );
            break;
        default: // text, email, number
            content = (
                <label className={classes.FormField}>{props.label}
                    <input 
                        className={classes.Input}
                        type={props.type}
                        name={props.name}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.changed}
                        onBlur={props.blurred}
                        disabled={props.disabled}
                        required={props.required}
                        pattern={props.pattern}
                        onFocus={props.focused} />
                    {errorsElement}
                </label>
            );
            break;
    }

    return content;
};


export default formFieldTest;