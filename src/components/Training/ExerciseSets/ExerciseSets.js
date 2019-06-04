import React from 'react';
import classes from './ExerciseSets.module.css';
//import uuid from 'uuid';

const exerciseSets = props => { 
    let setNo = [];
    let reps = [];
    let weight = [];
    let comment = [];
    // let tempo = [];
    // let drop = [];

    if (props.sets) {
        let sets = props.sets;//.sort(x => x.posNo); // TODO: there is always -1 pos

        const setsLen = sets.length;
        for (let i = 0; i < setsLen; i++) {
            setNo.push(<td key={i}>{i+1}</td>);
            weight.push(<td key={i}>{sets[i].weight}</td>);
            reps.push(<td key={i}>{sets[i].reps}</td>);
            // tempo.push(<td key={i}>{sets[i].tempo}</td>);
            // drop.push(<td key={i}>{sets[i].drop}</td>);
            comment.push(<td className={classes.CommentCell} key={i}><div className={classes.CommentCellDiv}>{sets[i].comment}</div></td>);
        }
    }

    return (
        <div className={classes.ExerciseSets}>
            Sets:
            <div className={classes.TableWrapper} >
                <table>
                    <tbody>
                        <tr><th>Set#:</th>{setNo}</tr>
                        <tr><th>Weight:</th>{weight}</tr>
                        <tr><th>{props.units === 2 ? "Time[s]:" : "Reps:"}</th>{reps}</tr>
                        {/* <tr><th>Tempo:</th>{tempo}</tr>
                        <tr><th>Drop:</th>{drop}</tr> */}
                        <tr><th>Comm:</th>{comment}</tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default exerciseSets;
