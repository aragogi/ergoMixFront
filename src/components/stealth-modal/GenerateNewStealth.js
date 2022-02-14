import React, { useState } from "react";
import ProjectModal from "../modal/modal";
import { TextField } from "@material-ui/core";
import { ApiNetwork } from "../../network/api";
import CopyClipboard from "../copy-clipboard/CopyClipboard";
import QRCode from "react-qr-code";

export default function GenerateNewStealth(props) {
    const [show, setShow] = useState(false);
    const [pk, setPK] = useState("");
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const generateAddress = () => {
        if(!loading) {
            setLoading(true);
            ApiNetwork.createStealthPaymentAddress(pk).then(res => {
                setAddress(res.address)
                setLoading(false);
            })
        }
    }
    const savePK = event => {
        setPK(event.target.value);
    }
    return (
        <React.Fragment>
            <ProjectModal close={() => {
                setShow(false)
            }} show={show} scroll={'hidden'}>
                <div className="row">
                    <div className="col-12">
                        <TextField
                            label="Stealth PrivateKey"
                            onChange={savePK}
                            error={pk === ''}
                            value={pk}
                            required={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <button className="btn" onClick={() => setShow(false)}>Close</button>
                        <button
                            className="btn btn-success"
                            disabled={pk === ''}
                            onClick={() => generateAddress()}>
                            Generate
                        </button>
                    </div>
                </div>
                {address ? (
                <div className="row">
                    <div className="col-12 text-center">
                        <br/>
                        <br/>
                        <CopyClipboard value={address}/>
                        <br/>
                        <QRCode size={256} value={address}/>

                    </div>
                </div>
                ) : null}
            </ProjectModal>
            <button className="btn btn-outline-primary" onClick={() => setShow(true)}
                    style={{marginRight: "15px"}}>Generate Address
                {loading === "withdraw" ? <i className="fa fa-circle-o-notch fa-spin"/> : null}

            </button>
        </React.Fragment>);
}
