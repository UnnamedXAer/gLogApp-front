import React from 'react';
import classes from './Exercise.module.css';
import RoundButton from '../../UI/RoundButton/RoundButton';
// import Aux from '../../../hoc/Auxiliary';


const exercise = props => {
    console.log(props.exercise);

    
    const sets = props.exercise.sets;

    let setsContent = null;
    let tempoContent = null;
    if (props.inEdit) {
        tempoContent = 
            <label>Tempo: 
                <input 
                    type="text" 
                    name="tempo" 
                    value={props.exercise.tempo} 
                    onChange={(ev) => props.inputChanged(ev, props.exercise.id)}
                    className={classes.TempoInp} />
            </label>;


        setsContent = <div className={classes.EditSets + (props.higlight ? (" "+classes.Higlight) : "")}  > Sets: 
                {sets.map((x, i) => 
                    (<input 
                        name="set"
                        type="number"
                        className={classes.RepsInput} 
                        value={x} key={i} 
                        onChange={(ev) => props.inputChanged(ev, props.exercise.id, i)}
                        onBlur={(ev) => props.setInputBlured(ev, props.exercise.id, i)} />)
                )}
            </div>
    }   
    else {
        let allRepsNumberEqual = true;
        for (let i = sets.length -1; i >= 0; i--) {
            if (sets[i-1] && sets[i] !== sets[i-1]) {
                allRepsNumberEqual = false;
                break;
            }
        }

        tempoContent = <p>Tempo: {props.exercise.tempo}</p>;

        if (allRepsNumberEqual) {
            setsContent = <p className={classes.ColapsedSets} > Sets: 
                    {sets[0] + "x" + sets.length}
                </p>
        }
        else {
            setsContent = <p className={classes.ColapsedSets} > Sets: 
                    {props.exercise.sets.map(x => x + ":")}
                </p>
        }
    }


    return (
        <div className={classes.Exercise} onClick={(ev) => props.clicked(ev, props.exercise.id)}>
            <h5>{props.exercise.name}</h5>
            <div className={classes.Tempo}>{tempoContent}</div>
            {setsContent}
            {props.inEdit ? <div className={classes.NewSet}><input 
                        name="newSet"
                        type="number"
                        className={classes.RepsInput} 
                        value={props.newSet} 
                        ref={props.newSetRef}
                        // ref={props.ref}
                        // key={sets.length} 
                        onChange={(ev) => props.inputChanged(ev, props.exercise.id, sets.length)} 
                        /> 
                        <RoundButton clicked={(ev) => props.addSet(ev, props.exercise.id)} />
                    </div>
                        : null}
        </div>
    );
}

export default exercise;