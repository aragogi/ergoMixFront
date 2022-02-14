import React, {useState} from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import {connect} from "react-redux";
// import { ApiNetwork } from "../../../network/api";
// import Loading from "../../../components/loading/Loading";
// import CovertCard from "../../../components/status-card/covert-card/CovertCard";
import { NavLink } from "react-router-dom";
import StealthCard from "../../components/status-card/stealth-card/StealthCard";
import CovertCard from "../../components/status-card/covert-card/CovertCard";
import ProjectModal from "../../components/modal/modal";
import { TextField } from "@material-ui/core";
import generateNewStealth from "../../components/stealth-modal/GenerateNewStealth";
import GenerateNewStealth from "../../components/stealth-modal/GenerateNewStealth";
import { ApiNetwork } from "../../network/api";
// import ProjectModal from "../../../components/modal/modal";
// import { TextField } from "@material-ui/core";
// import { COVERT_NAME_SIZE } from "../../../const";
// import Panel from "../../../components/panel/Panel";
// import * as formatter from "../../../formatter/formatters";
// import DataTable from "../../../components/table/assetTable";
// import { NotificationManager } from "react-notifications";


const create = (
    <div style={{display: "flex", alignItems: "flex-end"}}>
        <GenerateNewStealth/>
        <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/stealth/new'>
            New Stealth
        </NavLink>
    </div>
);


class StealthList extends React.Component {
    state = {
        addresses: [
            // {id: "stealth-1", name: "test address", pk:"stealth:123456789012345678901234567890123456789012345678901234567890AAAAAA"},
            // {id: "stealth-1", name: "test address", pk:"stealth:123456789012345678901234567890123456789012345678901234567890AAAAAA"},
        ],
        showGenerateAddress: false,
        loading: false,
    };
    closeModal = () => {
        this.setState({
            showGenerateAddress: false,
        })
    }
    showGenerateAddress = () => {
        this.setState({showGenerateAddress: true})
    }

    loadData = () => {
        console.log(this.state)
        if(!this.state.loading && this.state.addresses.length === 0) {
            this.setState({loading: true})
            ApiNetwork.getStealthAddresses().then(addresses => {
                console.log(addresses)
                this.setState({loading: false, addresses: addresses.stealthAddresses})
            })
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    componentDidUpdate = () => {
        this.loadData();
    }

    // TODO:
    //     api to call addresses should be implemented and after that function to fill the state

    render() {
        return (
            <React.Fragment>
                <ProjectModal close={this.closeModal} show={this.state.showGenerateAddress} scroll={'hidden'}>
                    <div className="row">
                        <div className="col-12">
                            <TextField
                                label="Stealth PrivateKey"
                                onChange={this.saveName}
                                error={this.state.editingName === ''}
                                value={this.state.editingName}
                                required={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn" onClick={this.closeModal}>Close</button>
                            <button
                                className="btn btn-success"
                                disabled={this.state.editingName === ''}
                                onClick={this.submitName}>
                                Save
                            </button>
                        </div>
                    </div>
                </ProjectModal>
                <div className="row">
                    {this.state.addresses.map((address, index) => (
                        <StealthCard {...address}/>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    // loadedData: state.loadedData,
    // tokens: state.tokens,
    // levels: state.mixLevel,
});

export default withLayout(MainLayout, {create: create})(connect(mapStateToProps)(StealthList));
