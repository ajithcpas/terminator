import React from "react";
import Utils from "../utils/utils";
import OrderWindowContext from "../orders/OrderWindowContext";
import WatchlistItem from "./WatchlistItem";

function handleOrderWindow(state, item, callbackFn) {
  item.minQty = Utils.getMinQty(item);
  item.qty = item.minQty;
  item.price = item.lastPrice;
  item.triggerPrice = item.lastPrice;
  callbackFn(state, item);
}

class Watchlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleClick(e) {
    let element = e.currentTarget;
    element.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    let element = e.currentTarget;
    let selectedElement = element.querySelector(".selected");
    switch (e.keyCode) {
      case 38: {
        //up arrow
        if (!selectedElement) {
          element.firstChild.classList.add("selected");
        } else {
          selectedElement.classList.remove("selected");
          if (selectedElement.previousSibling) {
            selectedElement.previousSibling.classList.add("selected");
          } else {
            element.lastChild.classList.add("selected");
          }
        }
        break;
      }
      case 40: {
        //down arrow
        if (!selectedElement) {
          element.firstChild.classList.add("selected");
        } else {
          selectedElement.classList.remove("selected");
          if (selectedElement.nextSibling) {
            selectedElement.nextSibling.classList.add("selected");
          } else {
            element.firstChild.classList.add("selected");
          }
        }
        break;
      }
      case 66: {
        //B
        if (selectedElement) {
          let i = 0;
          let child = selectedElement;
          while ((child = child.previousSibling) != null) i++;
          handleOrderWindow("B", this.props.items[i], this.context);
        }
        break;
      }
      case 83: {
        //S
        if (selectedElement) {
          let i = 0;
          let child = selectedElement;
          while ((child = child.previousSibling) != null) i++;
          handleOrderWindow("S", this.props.items[i], this.context);
        }
        break;
      }
      default:
        break;
    }
  }

  render() {
    const watchlistItems = this.props.items;
    return (
      <table className="table table-hover table-dark">
        <tbody tabIndex="2" onKeyDown={this.handleKeyDown} autoFocus={true}>
          {watchlistItems.map((value, index) => (
            <WatchlistItem key={index} value={value} />
          ))}
        </tbody>
      </table>
    );
  }
}
Watchlist.contextType = OrderWindowContext;

export default Watchlist;
export { handleOrderWindow };
