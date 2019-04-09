import React, { Component } from 'react';
import SelectedElement from '../../components/UI/Multiselect/SelectedElement/SelectedElement';
import MultiselectInput from '../../components/UI/Multiselect/MultiselectInput/MultiselectInput';
import MultiselectSelectBox from '../../components/UI/Multiselect/MultiselectSelectBox/MultiselectSelectBox';
import { getReducedArray, compareByNameProperty as compare } from '../../utility';
import classes from './Multiselect.css';

class Multiselect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: [],
            inputValue: "",
            showSelectBox: false,
            focusedOption: 0,
            availableOptions: [...this.props.options]
        }
        this.dataLoaded = false;

        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();

        this.optionRefs = {};

        this.blurTimeout =  null;
    }

    selectBoxScrollTo(id) {
        const ref = this.optionRefs[id];
        if (ref) {
            ref.scrollIntoView();
        }
    }

    inputChangedHandler = (ev) => {
        const value = ev.target.value;
        this.setState({inputValue: value});
        const len = value.length;
        let options = [...this.props.options];
        options = options.filter(x => x.name.substring(0,len).toLowerCase() === value.toLowerCase());
        const selectedOptions = [...this.state.selectedOptions];
        const newOptions = getReducedArray(options, selectedOptions);
        this.setState({availableOptions: newOptions, showSelectBox: true, focusedOption: 0});
    }

    multiselectOptionClickHandler = (ev, newOption) => {
        this.addToSelected(newOption);
    }

    addToSelected = (newOption) => {
        const selectedOptions = [...this.state.selectedOptions];
        selectedOptions.push(newOption);

        const newOptions = getReducedArray([...this.props.options], selectedOptions);
        newOptions.sort(compare);
        this.setState({
            availableOptions: newOptions, 
            selectedOptions: selectedOptions,
            inputValue: ""
        });

        const selectedIds = selectedOptions.map(x => x.id);
        this.props.sendSelectedOnSelect(selectedIds, this.props.dataName);
        this.textInput.current.focus();
    }

    selectedElementRemoveClickHandler = (ev, id) => {
        let selectedOptions = [...this.state.selectedOptions];
        const indexOfRemoved = selectedOptions.findIndex(x => x.id === id);

        let availableOptions = [...this.state.availableOptions];
        availableOptions.push(selectedOptions[indexOfRemoved]);
        availableOptions.sort(compare);
        // push before remove
        selectedOptions.splice(indexOfRemoved, 1);

        this.setState({selectedOptions: selectedOptions, availableOptions: availableOptions});

        const selectedIds = selectedOptions.map(x => x.id);
        this.props.sendSelectedOnSelect(selectedIds, this.props.dataName);
        this.textInput.current.focus();
    }

    blurHandler = (ev) => {

        this.blurTimeout = setTimeout(() => {

            if (this.state.showSelectBox) {
                this.setState({showSelectBox: false});
            }
        }, 1);
    }

    focusHandler = (ev) => {
        clearTimeout(this.blurTimeout);
    }

    elementsContainerClickHandler = (ev) => {
        this.textInput.current.focus();
    }

    toggleSelectboxHandler = (ev) => {
        const show = !this.state.showSelectBox;
        
        if (show) {
            this.setState({showSelectBox: show});
            this.textInput.current.focus();
        }
        else {
            this.setState({showSelectBox: show, inputValue: ""});
        }
    }

    inputKeyDownHandler = (ev) => {
        let focusedOption;
        switch (ev.keyCode) {
            case 40: //down
                if (!this.state.showSelectBox) {
                    this.setState({showSelectBox: true});
                }
                else {
                    focusedOption = this.state.focusedOption+1;
                    if (focusedOption < this.state.availableOptions.length)
                        this.setState({focusedOption: focusedOption});
                        this.selectBoxScrollTo(focusedOption);
                }
                break;
            case 38: //up
                focusedOption = this.state.focusedOption-1; 
                if (focusedOption >= 0) {
                    this.setState({focusedOption: focusedOption});
                    this.selectBoxScrollTo(focusedOption);
                }
                break;
            case 13: //enter
                const option = this.state.availableOptions[this.state.focusedOption];
                if (option !== undefined && this.state.showSelectBox)
                    this.addToSelected(option);
                break;
            case 27: //esc
                this.setState({inputValue: "", showSelectBox: false});
            break;
            default:
                break;
        }
    }

    removeAllSelectedHandler = (ev) => {
        let sortedOptions = [...this.props.options];
        sortedOptions.sort(compare);
        this.setState({selectedOptions: [], availableOptions: sortedOptions, inputValue: ''});
        this.textInput.current.focus();
    }

    selectBoxOptionMouseEnterHandler = (ev, idx) => {
        this.setState({focusedOption: idx});
    }

    selectBoxSetRef = (el, idx) => {
        this.optionRefs[idx] = el;
    }

    componentDidUpdate() {
        if (!this.dataLoaded && this.state.availableOptions.length === 0 && this.props.options.length > 0) {
            this.dataLoaded = true;
            let sortedOptions = [...this.props.options];
            sortedOptions.sort(compare);
            this.setState({availableOptions: sortedOptions});
            console.log('available updated ',this.props.dataName );
        }
    }

    render() {
        return (
            <div className={classes.MultiSelect} style={{width: (this.props.width ? this.props.width: "80%")}} >
                <h4 className={classes.MultiselectTitle}>{this.props.title}</h4>
                <div className={classes.Container + (this.state.showSelectBox ? (" "+classes.ContainerBottomNoRadius) : "")} 
                    onBlur={this.blurHandler}  
                    onFocus={this.focusHandler} 
                    tabIndex="0">
                    <div className={classes.Elements} onClick={this.elementsContainerClickHandler} >
                        {this.state.selectedOptions.map((option) =>
                                <SelectedElement 
                                    key={option.id} 
                                    name={option.name} 
                                    id={option.id} 
                                    removeClicked={this.selectedElementRemoveClickHandler.bind(this)} />
                            )
                        }
                        <MultiselectInput 
                            keyDown={this.inputKeyDownHandler}
                            dataName={this.props.dataName} 
                            inputValue={this.state.inputValue} 
                            inputValueChanged={this.inputChangedHandler} 
                            ref={this.textInput} />
                    </div>
                    <div className={classes.Buttons}>
                        <div className={classes.Button + " " +classes.Clear} onClick={this.removeAllSelectedHandler}>×</div>
                        <div className={classes.Button + " " + classes.Expand} onClick={this.toggleSelectboxHandler}>
                            <span className={classes.Arrow + (this.state.showSelectBox ? (" " + classes.RotateArrow) : "")}></span>
                        </div>
                    </div>
                </div>
                <div className={classes.SelectBoxWrapper}>
                    <MultiselectSelectBox 
                        elementClicked={this.multiselectOptionClickHandler}
                        data={this.state.availableOptions}
                        show={this.state.showSelectBox}
                        focusedOption={this.state.focusedOption} 
                        mouseEntered={this.selectBoxOptionMouseEnterHandler}
                        setRef={this.selectBoxSetRef}
                        focused={this.focusHandler}
                        blur={this.blurHandler}
                    />
                </div>
            </div>
        );
    }
}

export default Multiselect;
