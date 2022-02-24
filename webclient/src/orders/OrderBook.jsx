import React from "react";
import Order from "./Order";

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      orders: []
    };
  }

  getOrders() {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            orders: result.success
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
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
      exe_order_count = orders.filter((order) => "TRAD,CAN".includes(order.status)).length;

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

export default OrderBook;
