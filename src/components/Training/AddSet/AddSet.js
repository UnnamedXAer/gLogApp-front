
import React from 'react';
import classes from './AddSet.module.css';
import RoundButton from '../../UI/RoundButton/RoundButton';

const addSet = (props) => {
    if (props.readOnly) {
        return null;
    }
    return (
        <div className={classes.AddSet}>    
                <div className={classes.AddSetTitle}>New set: </div>
                <label >Weight: <input size="3" type="number" min="0" max="999" step="0.01" name="currentWeight"
                    value={props.weightVal} onChange={props.elementValueChanged} placeholder="[eg. 17.5]" /></label>
                <label>Reps: <input type="number" min="0" max="999" step="1" size="3" name="currentReps" 
                    value={props.repsVal} placeholder="[eg. 12]" onChange={props.elementValueChanged} /></label>
                <div className={classes.FormElement}>
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
                </div>
                <label >Comment: 
                    <textarea rows="2" cols="30" 
                        placeholder="Type comment for this set." 
                        name="currentComment"
                        value={props.commentVal}
                        onChange={props.elementValueChanged} />
                </label>
            <div className={classes.ButtonWraper}>
                <RoundButton 
                    sign="tick"
                    float="right"
                    clicked={props.addSet} />
            </div>
        </div>
    );
}


export default addSet;