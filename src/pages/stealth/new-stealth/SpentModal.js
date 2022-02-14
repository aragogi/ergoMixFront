import React, { useState } from "react";
import ProjectModal from "../../../components/modal/modal";
import Tooltip from "../../../components/tooltip/Tooltip";
import * as formatter from "../../../formatter/formatters";
import { ApiNetwork } from "../../../network/api";

const SpentModal = (props) => {
    const [loading, setLoading] = useState(false);
    const updateBox = (newAddress, index) => {
        const newBox = {...props.boxes[index]}
        newBox.spentAddress=newAddress;
        props.updateBoxes(newBox, index)
    }
    const spent = () => {
        if(!loading) {
            setLoading(true)
            const boxes = props.boxes.filter(item => item.checked && item.spentAddress).map(item => ({
                address: item.spentAddress, boxId: item.boxId
            }));
            ApiNetwork.spentStealthBoxes(props.stealthId, {data: boxes}).then(() => {
                props.close();
                setLoading(false);
            })
        }
    }
    return (
        <ProjectModal close={props.close} show={props.show} scroll={'hidden'}>
            <div className="row">
                <div className="col-12">
                    <div className="card-body" style={{overflowY: 'scroll', maxHeight: '40vh'}}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead className=" text-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Amount</th>
                                    <th>Withdraw Address</th>
                                </tr>
                                </thead>
                                <tbody>
                                {props.boxes.map((box, index) => box.checked ? (
                                    <tr key={index}>
                                        <td>
                                            <Tooltip title={<span className="tooltip-text">{box.boxId}</span>} arrow>
                                                <div>{formatter.id(box.boxId)}</div>
                                            </Tooltip>
                                        </td>
                                        <td>{formatter.token(box.value, "")}</td>
                                        <td>
                                            <input className={"form-control"}
                                                   autoFocus={index === 0}
                                                   value={box.spentAddress ? box.spentAddress : ""}
                                                   onChange={(event) => updateBox(event.target.value, index)}/>
                                        </td>
                                    </tr>
                                ) : null)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row" style={{padding:20}}>
                        <div className="col-md-12">
                            <button className="btn btn-outline-warning" style={{width: "100%"}} onClick={spent}>
                                {loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                &nbsp;&nbsp;Spent Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>        </ProjectModal>
    )
}

export default SpentModal
