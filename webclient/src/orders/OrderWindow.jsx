import React from "react";
import Utils from "../utils/utils";
import Input from "../utils/FormUtil";
import ToastContext, { formatResponse } from "../utils/ToastContext";
import { BiTransferAlt } from "react-icons/bi";

class OrderWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.value.show,
      buyToggleSwitch: this.props.value.state === "B",
      disablePriceInput: false,
      disableTriggerPriceInput: true,
      orderType: "LIMIT",
      showSyncSL: false,
      syncSL: true
    };

    this.handleBuyToggleSwitch = this.handleBuyToggleSwitch.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSyncSL = this.handleSyncSL.bind(this);
  }

  handleBuyToggleSwitch() {
    this.setState({ buyToggleSwitch: !this.state.buyToggleSwitch });
  }

  handleInputChange(name, value) {
    this.setState({ [name]: value });
  }

  handleSubmit() {
    let data = {
      order: this.state.buyToggleSwitch ? "BUY" : "SELL",
      qty: parseInt(this.state.qty),
      orderType: this.state.orderType,
      price: Utils.parseFloat(this.state.price),
      triggerPrice: Utils.parseFloat(this.state.triggerPrice),
      instrumentToken: this.props.value.data.instrumentToken
    };

    if (data.orderType === "MARKET" || data.orderType === "SLM") {
      data.price = 0;
    }
    if (data.orderType === "MARKET" || data.orderType === "LIMIT") {
      data.triggerPrice = 0;
    }
    if (data.orderType === "SL" && this.state.syncSL) {
      data.price = data.triggerPrice;
    }

    if (this.props.value.data.orderId) {
      data.orderId = this.props.value.data.orderId;
    }

    console.log("submit order ", data);
    fetch("/api/place_order", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          let data = formatResponse(result);
          this.context(data);
        },
        (error) => {
          console.log(error);
          alert(error);
        }
      );
    //     this.handleCancel();
  }

  handleCancel() {
    this.setState({ show: false });
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleOrderTypeChange(e) {
    let orderType = e.currentTarget.value;
    this.setState({
      orderType: orderType,
      disablePriceInput:
        orderType === "MARKET" || orderType === "SLM" || (orderType === "SL" && this.state.syncSL),
      disableTriggerPriceInput: orderType === "MARKET" || orderType === "LIMIT",
      showSyncSL: orderType === "SL"
    });
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 13: {
        //Enter
        this.handleSubmit();
        break;
      }
      case 27: {
        //Esc
        this.handleCancel();
        break;
      }
      case 66: {
        //B
        if (!this.state.buyToggleSwitch) {
          this.handleBuyToggleSwitch();
        }
        break;
      }
      case 83: {
        //S
        if (this.state.buyToggleSwitch) {
          this.handleBuyToggleSwitch();
        }
        break;
      }
      default:
        break;
    }
  }

  handleSyncSL() {
    let syncSL = !this.state.syncSL;
    this.setState({ syncSL: syncSL, disablePriceInput: syncSL });
  }

  componentDidUpdate(prevProps) {
    if (this.props.value === prevProps.value) {
      return;
    }

    let state = {
      show: this.props.value.show,
      buyToggleSwitch: this.props.value.state === "B",
      disablePriceInput: this.state.orderType === "MARKET" || this.state.orderType === "SLM",
      disableTriggerPriceInput:
        this.state.orderType === "MARKET" || this.state.orderType === "LIMIT",
      minQty: this.props.value.data.minQty,
      qty: this.props.value.data.qty,
      tickSize: 0.05,
      price: this.props.value.data.price,
      triggerPrice: this.props.value.data.triggerPrice
    };

    if (this.props.value.data.orderType) {
      let orderType = this.props.value.data.orderType;
      state.orderType = orderType;
      state.disablePriceInput = orderType === "MARKET" || orderType === "SLM";
      state.disableTriggerPriceInput = orderType === "MARKET" || orderType === "LIMIT";
    }
    this.setState(state);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  render() {
    if (!this.state.show) {
      return null;
    }

    const buyToggleSwitch = this.state.buyToggleSwitch;
    return (
      <div className="order-window">
        <div className="header">
          <span className="transaction-type">{buyToggleSwitch ? "Buy" : "Sell"}&nbsp;</span>
          <span>{Utils.getInstrumentName(this.props.value.data)}</span>
          <div className="form-check form-switch float-end">
            <input
              type="checkbox"
              onChange={this.handleBuyToggleSwitch}
              className="form-check-input"
              role="switch"
              checked={!buyToggleSwitch}
            />
          </div>
        </div>
        <div className="body">
          <div className="row mb-10p">
            <div className="col">
              <Input
                label="Qty."
                type="number"
                className="form-control"
                name="qty"
                minValue={this.state.minQty}
                value={this.state.qty}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="col">
              <Input
                label="Price"
                type="number"
                className="form-control"
                name="price"
                minValue={this.state.tickSize}
                value={this.state.price}
                autoFocus={true}
                disabled={this.state.disablePriceInput}
                onChange={this.handleInputChange}
              />
            </div>
            {this.state.showSyncSL ? (
              <div
                className={"transfer-icon " + (this.state.syncSL ? "selected" : "")}
                onClick={this.handleSyncSL}>
                <BiTransferAlt size={15} />
              </div>
            ) : null}

            <div className="col">
              <Input
                label="Trigger Price"
                type="number"
                className="form-control"
                name="triggerPrice"
                minValue={this.state.tickSize}
                value={this.state.triggerPrice}
                disabled={this.state.disableTriggerPriceInput}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <label className="form-check-label" htmlFor="orderTypeMarket">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderType"
                    id="orderTypeMarket"
                    value="MARKET"
                    checked={this.state.orderType === "MARKET"}
                    onChange={this.handleOrderTypeChange}
                  />
                  Market
                </div>
              </label>

              <label className="form-check-label" htmlFor="orderTypeLimit">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderType"
                    id="orderTypeLimit"
                    value="LIMIT"
                    checked={this.state.orderType === "LIMIT"}
                    onChange={this.handleOrderTypeChange}
                  />
                  Limit
                </div>
              </label>
            </div>
            <div className="col-md-4 text-end">
              <label className="form-check-label" htmlFor="orderTypeSL">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderType"
                    id="orderTypeSL"
                    value="SL"
                    checked={this.state.orderType === "SL"}
                    onChange={this.handleOrderTypeChange}
                  />
                  SL
                </div>
              </label>
              <label className="form-check-label" htmlFor="orderTypeSLM">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderType"
                    id="orderTypeSLM"
                    value="SLM"
                    checked={this.state.orderType === "SLM"}
                    onChange={this.handleOrderTypeChange}
                  />
                  SLM
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="text-end">
            <button
              className={"btn " + (buyToggleSwitch ? "bg-color-blue" : "bg-color-red")}
              onClick={this.handleSubmit}>
              {buyToggleSwitch ? "Buy" : "Sell"}
            </button>
            <button className="btn button-outline" onClick={this.handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

OrderWindow.contextType = ToastContext;

export default OrderWindow;
