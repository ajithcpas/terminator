import React from "react";
import Utils from "./utils";
import HoverComponent from "./HoverComponent";
import OrderWindowContext from "./OrderWindowContext";
import { Modal } from "react-bootstrap";
import ToastContext, { formatResponse } from "./ToastContext";

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCancelOrderModal: false,
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
      headers: { "Content-Type": "application/json" },
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
    const orders = this.props.orders;
    return (
      <div>
        <Modal
          show={this.state.showCancelOrderModal}
          onHide={() => this.setShowCancelOrderModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <button
              className="btn button-outline"
              onClick={() => this.setShowCancelOrderModal(false)}
            >
              No
            </button>
            <button
              className="btn bg-color-blue"
              onClick={() => {
                this.setShowCancelOrderModal(false);
                this.handleCancelOrder();
              }}
            >
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
              .map((order, index) => (
                <tr key={order.orderId}>
                  <td>{order.orderTimestamp}</td>
                  <td>
                    <span
                      className={
                        "text-label small " +
                        (order.transactionType === "BUY" ? "blue" : "red")
                      }
                    >
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
                                onClick={() =>
                                  this.handleModifyOrder(
                                    order,
                                    orderWindowHandler
                                  )
                                }
                              >
                                M
                              </button>
                            )}
                          </OrderWindowContext.Consumer>
                          <button
                            type="button"
                            className="btn cancel"
                            onClick={() =>
                              this.setShowCancelOrderModal(true, order)
                            }
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
                      className={
                        "text-label small " +
                        (order.status === "TRAD" ? "green" : "")
                      }
                    >
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

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      orders: [],
    };
  }

  getOrders() {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            orders: result.success,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    const { error, isLoaded, orders } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let open_order_count = 0,
        exe_order_count = 0;
      open_order_count = orders.filter(
        (order) => order.status === "OPN" || order.status === "SLO"
      ).length;
      exe_order_count = orders.filter((order) =>
        "TRAD,CAN".includes(order.status)
      ).length;

      return (
        <div className="orderbook">
          <div className="row open-orders">
            <div>
              <h5>Open Orders ({open_order_count})</h5>
            </div>
            <Order orders={orders} type="OPN,SLO" />
          </div>

          <div className="row executed-orders">
            <div>
              <h5>Executed Orders ({exe_order_count})</h5>
            </div>
            <Order orders={orders} type="TRAD,CAN" />
          </div>
        </div>
      );
    }
  }
}

OrderBook.contextType = ToastContext;

export default OrderBook;
