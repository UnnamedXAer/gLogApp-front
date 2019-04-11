import React from 'react';
import classes from './FormField.module.css';


const formField = props => {

    let content = null;

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
                    <span className={classes.Error}>
                        {(props.validator && props.errors4Fields && props.errors4Fields.indexOf(props.name) > -1) ? 
                            props.validator.message(props.name, props.validatorValues ? props.validatorValues : props.value, props.rules) : null}
                    </span>
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
                    <span className={classes.Error}>
                        {(props.validator && props.errors4Fields && props.errors4Fields.indexOf(props.name) > -1) ? 
                            props.validator.message(props.name, props.validatorValues ? props.validatorValues : props.value, props.rules) : null}
                    </span>
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
                    <span className={classes.Error}>
                        {(props.validator && props.errors4Fields && props.errors4Fields.indexOf(props.name) > -1) ? 
                            props.validator.message(props.name, props.validatorValues ? props.validatorValues : props.value, props.rules) : null}
                    </span>
                    <img className={classes.ImgPreview} src={require("../../../img/avatar-blank.png")} ref={props.imgPreviewRef} alt="Avatar" />
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
                    <span className={classes.Error}>
                        {props.additionalError ? props.additionalError : null}
                        {(props.validator && props.errors4Fields && props.errors4Fields.indexOf(props.name) > -1) ? 
                            props.validator.message(props.name, props.validatorValues ? props.validatorValues : props.value, props.rules) : null}
                    </span>
                </label>
            );
            break;
    }

    return content;
};


export default formField;