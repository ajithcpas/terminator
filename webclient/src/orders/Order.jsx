import React from "react";
import { Modal } from "react-bootstrap";
import Utils from "../utils/utils";
import HoverComponent from "../utils/HoverComponent";
import OrderWindowContext from "./OrderWindowContext";
import { formatResponse } from "../utils/ToastContext";

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCancelOrderModal: false
    };
  }

  setShowCancelOrderModal(value, order) {
    let state = { showCancelOrderModal: value };
    if (order) {
      state.order = order;
    }
    this.setState(state);
  }

  handleModifyOrder(order, callbackFn) {
    let state = order.transactionType === "BUY" ? "B" : "S";
    order.minQty = order.marketLot;
    order.qty = order.pendingQuantity;
    if (order.triggerPrice <= 0) {
      order.orderType = "LIMIT";
    } else if (order.price <= 0) {
      order.orderType = "SLM";
    } else {
      order.orderType = "SL";
    }
    callbackFn(state, order);
  }

  handleCancelOrder() {
    let order = this.state.order;
    fetch("/api/cancel_order", {
      method: "POST",
      body: JSON.stringify(order),
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
  }

  render() {
    const orders = this.props.orders.sort((a, b) =>
      b.orderTimestamp.localeCompare(a.orderTimestamp)
    );
    return (
      <div>
        <Modal
          show={this.state.showCancelOrderModal}
          onHide={() => this.setShowCancelOrderModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <button
              className="btn button-outline"
              onClick={() => this.setShowCancelOrderModal(false)}>
              No
            </button>
            <button
              className="btn bg-color-blue"
              onClick={() => {
                this.setShowCancelOrderModal(false);
                this.handleCancelOrder();
              }}>
              Yes
            </button>
          </Modal.Footer>
        </Modal>
        <table className="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Instrument</th>
              <th scope="col" className="text-end">
                Qty.
              </th>
              <th scope="col" className="text-end">
                Avg.price
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => this.props.type.includes(order.status))
              .map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderTimestamp}</td>
                  <td>
                    <span
                      className={
                        "text-label small " + (order.transactionType === "BUY" ? "blue" : "red")
                      }>
                      {order.transactionType}
                    </span>
                  </td>
                  <td className="position-relative">
                    <span>{Utils.getInstrumentName(order)}</span>
                    {this.props.type.includes("OPN,SLO") ? (
                      <HoverComponent>
                        <span className="actions">
                          <OrderWindowContext.Consumer>
                            {(orderWindowHandler) => (
                              <button
                                className="btn modify"
                                onClick={() => this.handleModifyOrder(order, orderWindowHandler)}>
                                M
                              </button>
                            )}
                          </OrderWindowContext.Consumer>
                          <button
                            type="button"
                            className="btn cancel"
                            onClick={() => this.setShowCancelOrderModal(true, order)}
                            // onClick={() => this.handleCancelOrder(order)}
                          >
                            C
                          </button>
                        </span>
                      </HoverComponent>
                    ) : null}
                  </td>
                  <td className="text-end">
                    {order.filledQuantity}&nbsp;/&nbsp;{order.orderQuantity}
                  </td>
                  <td className="text-end">
                    {order.price}
                    {order.triggerPrice > 0 ? ` / ${order.triggerPrice}` : null}
                  </td>
                  <td>
                    <span
                      className={"text-label small " + (order.status === "TRAD" ? "green" : "")}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Order;
