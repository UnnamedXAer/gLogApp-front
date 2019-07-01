import React from 'react';
import classes from './AddSet.module.css';
import RoundButton from '../../UI/RoundButton/RoundButton';

const addSet = (props) => {
    if (props.readOnly) {
        return null;
    }
    console.log(props.errors)
    return (
        <div className={classes.AddSet}>    
                <div className={classes.AddSetTitle}>New set: </div>
                <div className={classes.FormElement}>
                    <label >Weight: <input size="3" type="number" min="0" max="999" step="0.01" name="currentWeight"
                        value={props.weightVal} onChange={props.elementValueChanged} placeholder="[eg. 17.5]" />
                        {props.errors.currentWeight ? <span className={classes.Error}>{props.errors.currentWeight}</span> : null } 
                    </label>
                </div>
                <div className={classes.FormElement}>
                    <label>{props.units === 2 ? "Time[s]:" : "Reps:"}<input type="number" min="0" max="999" step="1" size="3" name="currentReps" 
                        value={props.repsVal} placeholder="[eg. 12]" onChange={props.elementValueChanged} />
                        {props.errors.currentReps ? <span className={classes.Error}>{props.errors.currentReps}</span> : null }
                    </label>
                </div>
                {/* <div className={classes.FormElement}>
                    <label >Drop: <input 
                        name="currentDrop"
                        onChange={props.elementValueChanged} 
                        value={props.dropText}  
                        placeholder="Drop text" />
                    </label>
                </div>
                <div className={classes.FormElement}>
                    <label>
                        Tempo: <input 
                            type="text" 
                            value={props.tempoVal}
                            onChange={props.elementValueChanged}
                            name="currentTempo"
                            placeholder="Tempo text" />
                    </label>
                </div> */}
                <div className={classes.FormElement}>
                    <label >Comment: 
                        <div style={{paddingTop: '5px'}}>
                        <textarea rows="3" cols="40" 
                            placeholder="Type comment for this set." 
                            name="currentComment"
                            value={props.commentVal}
                            onChange={props.elementValueChanged} />
                        </div>
                    </label>
                </div>
            <div className={classes.ButtonWrapper}>
                <RoundButton 
                    sign="tick"
                    float="right"
                    clicked={props.addSet} />
            </div>
        </div>
    );
}


export default addSet;