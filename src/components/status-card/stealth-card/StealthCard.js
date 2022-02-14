import React from 'react';

import { connect } from "react-redux";
import CopyClipboard from "../../copy-clipboard/CopyClipboard";
import Tooltip from "../../tooltip/Tooltip";
import { IconButton } from "@material-ui/core";
import HistoryIcon from "@material-ui/icons/History";
import { withRouter } from "react-router";
import * as formatter from "../../../formatter/formatters";

class StealthCard extends React.Component {
    state = {}

    handleHistory = () => {
        this.props.history.push(`/stealth/${this.props.stealthId}/boxes`)
    }

    render() {
        return (
            <div className="col-12 col-md-6">
                <div className="card card-stats">
                    <div className="card-header card-header-icon card-header-success">
                        <div className="card-icon">
                            <i className="material-icons">call_split</i>
                        </div>
                        <h3 className="card-title">
                            <div className="float-right" style={{paddingLeft: "14px"}}>
                                <Tooltip title="History" arrow>
                                    <IconButton
                                        aria-controls="customized-menu"
                                        aria-haspopup="true"
                                        variant="contained"
                                        color="primary"
                                        aria-label="History"
                                        onClick={() => this.handleHistory()}
                                    >
                                        <HistoryIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div
                                style={{padding: "6px 12px 6px 0", textAlign: "left"}}
                            >
                                {this.props.stealthName ? this.props.stealthName : "No Name"}
                            </div>
                        </h3>
                    </div>
                    <div className="card-body statistic-card card-little text-left">
                        <div className="mt-2">
                            Amount: {formatter.token(this.props.value, "")}
                        </div>
                        <br/>
                        <div>
                            Stealth Payment Address:
                        </div>
                        <div>
                            {/*<QrcodeSVG className="pull-right" onClick={this.showQrCode}>gradient</QrcodeSVG>*/}
                            <CopyClipboard value={this.props.pk}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default withRouter(StealthCard);

