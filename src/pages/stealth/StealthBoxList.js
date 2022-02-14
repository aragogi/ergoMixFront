import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import OrderTd from '../../components/order-td/OrderTd';
import Tooltip from "../../components/tooltip/Tooltip";

import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ApiNetwork } from "../../network/api";
import Breadcrumb from "../../components/broadcom/Breadcrumb";
import Loading from "../../components/loading/Loading";
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import * as formatter from '../../formatter/formatters'
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import SpentModal from "./new-stealth/SpentModal";

class StealthBoxList extends React.Component {
    state = {
        boxes: [],
        withdrawShow: false,
        order: "id",
        orderDir: "asc",
        loadedId: "",
    };

    sortBox = (boxes, order, orderDir) => {
        if (order) {
            return boxes.sort(function (a, b) {
                const keyA = a[order],
                    keyB = b[order];
                // Compare the 2 dates
                if (keyA < keyB) return orderDir === "asc" ? -1 : 1;
                if (keyA > keyB) return orderDir === "asc" ? 1 : -1;
                return 0;
            });
        }
        return boxes
    }

    loadData = () => {
        let selectedMixes = [];
        this.state.boxes.forEach(box => {
            if (box.checked) {
                selectedMixes.push(box.id);
            }
        })
        const stealth = this.props.match.params.stealthId;
        if (this.state.loadedId !== stealth) {
            ApiNetwork.getStealthAddressBoxes(stealth).then((response => {
                const res = response.map(item => {
                    return {...item, checked: (selectedMixes.indexOf(item.id) >= 0), assetsCount: item.assets.length}
                });
                this.setState({
                    boxes: this.sortBox(res, this.state.order, this.state.orderDir),
                    loadedId: stealth,
                });
            })).catch(error => {

            });
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.loadData();
    }

    componentDidMount() {
        this.loadData();
    };

    updateBoxes = (box, index) => {
        const boxes = [...this.state.boxes];
        boxes[index] = box;
        this.setState({boxes: boxes})
    }

    closeModal = () => this.setState({withdrawShow: false});

    breadcrumbPath = () => {
        return [
            {url: '/stealth', title: 'Stealth'},
            {title: this.props.match.params.stealthId}
        ]
    };

    handleChange = indexOption => {
        const stat = this.statusSelected();
        const status = (stat === 'All' || stat === 'Indeterminate');
        const boxes = this.state.boxes.map((item, index) => {
            return {
                ...item,
                checked: indexOption !== undefined ? (index === indexOption ? !item.checked : item.checked) : !status
            };
        });
        this.setState({
            boxes: boxes,
        });
    };

    statusSelected = () => {
        const countChecked = this.state.boxes.filter(item => item.checked).length;
        const countAll = this.state.boxes.length;
        if (countChecked === countAll && countAll !== 0)
            return 'All';
        else if (0 << countChecked || countChecked << countAll)
            return 'Indeterminate';
        else
            return 'None';
    };

    showWithdrawDetail = () => this.setState({withdrawShow: true})

    setOrder = (order) => {
        this.setState(state => {
            const orderDir = (state.order === order && state.orderDir === "asc") ? "desc" : "asc";
            const boxes = this.sortBox(state.boxes, order, orderDir);
            return {...state, orderDir: orderDir, order: order, boxes: boxes}
        })
    }

    render() {
        const statusSelected = this.statusSelected();
        return (
            <div className="row">
                <Breadcrumb path={this.breadcrumbPath()}/>
                <SpentModal
                    show={this.state.withdrawShow}
                    close={this.closeModal}
                    stealthId={this.props.match.params.stealthId}
                    updateBoxes={this.updateBoxes}
                    boxes={this.state.boxes}/>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header card-header-tabs card-header-primary">
                            <ul className="nav nav-tabs" data-tabs="tabs">
                                <li className="nav-item">
                                    <a style={statusSelected !== "None" ? {cursor: "pointer"} : {cursor: "not-allowed"}}
                                       className={"nav-link active"}
                                       onClick={statusSelected !== "None" ? () => this.showWithdrawDetail() : null}>
                                        <i className="material-icons">edit</i> Spent Selected Rows
                                        <div className="ripple-container"/>
                                    </a>
                                </li>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </ul>
                        </div>
                        <div className="table-responsive">
                            <Loading loaded={this.state.loadedId === this.props.match.params.stealthId}
                                     empty={this.state.boxes.length === 0}
                                     emptyMessage={["There are no boxes for this stealth address"]}>
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr style={{textAlign: "center"}}>
                                        <th>&nbsp;</th>
                                        <th>
                                            <Checkbox
                                                indeterminate={statusSelected === 'Indeterminate'}
                                                icon={(<CheckBoxOutlineBlankIcon fontSize="small"/>)}
                                                checkedIcon={(<CheckBoxIcon fontSize="small"/>)}
                                                indeterminateIcon={(<IndeterminateCheckBoxIcon fontSize="small"/>)}
                                                checked={statusSelected === 'All'}
                                                onChange={event => this.handleChange()}
                                                color="secondary"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        </th>
                                        <OrderTd itemLabel="ID"
                                                 itemKey={"boxId"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Amount"
                                                 itemKey={"value"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Tokens"
                                                 itemKey={"assetsCount"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.boxes.map((boxItem, index) => (
                                        <tr key={index} style={{textAlign: "center"}}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                                    checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                                    checked={!!this.state.boxes[index].checked}
                                                    onChange={() => this.handleChange(index)}
                                                />
                                            </td>
                                            <td>
                                                <Tooltip title={<span className="tooltip-text">{boxItem.boxId}</span>}
                                                         arrow>
                                                    <div>{formatter.id(boxItem.boxId, 30)}</div>
                                                </Tooltip>
                                            </td>
                                            <td>{formatter.token(boxItem.value, "")}</td>
                                            <td>{boxItem.assetsCount}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Loading>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withLayout(MainLayout)(StealthBoxList);
