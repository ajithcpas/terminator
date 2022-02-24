import React from "react";
import HoverComponent from "../utils/HoverComponent";
import OrderWindowContext from "../orders/OrderWindowContext";
import Utils from "../utils/utils";
import { handleOrderWindow } from "./Watchlist";

class WatchlistItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.value;
    return (
      <tr className="watchlist-item">
        <td>
          <span>{Utils.getInstrumentName(item)}</span>
          <span className="float-end">{item.lastPrice}</span>
          <OrderWindowContext.Consumer>
            {(orderWindowHandler) => (
              <HoverComponent>
                <span className="actions">
                  <button
                    className="btn buy"
                    onClick={() => handleOrderWindow("B", item, orderWindowHandler)}>
                    B
                  </button>
                  <button
                    className="btn sell"
                    onClick={() => handleOrderWindow("S", item, orderWindowHandler)}>
                    S
                  </button>
                </span>
              </HoverComponent>
            )}
          </OrderWindowContext.Consumer>
        </td>
      </tr>
    );
  }
}

export default WatchlistItem;
