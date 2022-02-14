import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import Loading from "../../../components/loading/Loading";
import StealthStep1 from "./stealth-step-1/StealthStep1";
import { ApiNetwork } from "../../../network/api";

class NewStealth extends React.Component {
    state = {
        name: "",
        loading: false,
    };

    submit = () => {
        if (!this.state.loading) {
            return new Promise((resolve, reject) => {
                ApiNetwork.createStealthAddress(this.state.name).then(response => {
                    resolve();
                    this.props.history.push("/stealth")
                }).catch(exp => {
                    reject(exp);
                })
            });
        }
    }

    render() {
        return (
            <Loading empty={false} loadingMessage={[]} loaded={true}>
                <StealthStep1 saveValue={(value) => this.setState({name: value})}/>
                <div className="action-bar">
                    <button
                        className={"btn pull-right " + (this.state.name ? "btn-success" : "btn-default")}
                        onClick={() => this.submit()}>
                        Create Stealth Address
                        {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                    </button>
                </div>
            </Loading>
        )
    }
}

export default withLayout(MainLayout)(NewStealth);
