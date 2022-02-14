import React from 'react';
import { TextField } from "@material-ui/core";
// import Checkbox from '@material-ui/core/Checkbox';
import { connect } from "react-redux";
import Panel from "../../../../components/panel/Panel";
import { STEALTH_NAME_SIZE } from "../../../../const";

// import FormControlLabel from '@material-ui/core/FormControlLabel';

class StealthStep1 extends React.Component {
    state = {
        name: "",
    };

    saveName = value => {
        if (value) {
            value = value.substr(0, STEALTH_NAME_SIZE);
        }
        this.setState({name: value});
        if (this.props.saveValue) {
            this.props.saveValue(value);
        }
        return this.state.name
    }

    setValid = () => {
        if (this.props.setValid) {
            this.props.setValid(true)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setValid();
    }


    render() {
        return (
            <div className="col-sm-8 offset-sm-2">
                <Panel>
                    <div className="row">
                        <div className="col-12">
                            Specify a name for this stealth address for future reference.
                            This name can be edited anytime.
                        </div>
                        <div className="col-12 form-group">
                            <TextField
                                label="Name"
                                onBlur={event => this.saveName(this.state.name)}
                                onChange={event => this.saveName(event.target.value)}
                                value={this.state.name}
                                required={false}
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    // tokens: state.tokens
});

export default connect(mapStateToProps)(StealthStep1);
