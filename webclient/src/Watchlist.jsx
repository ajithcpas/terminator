import React from "react";
import Utils from "./utils";
import HoverComponent from "./HoverComponent";
import OrderWindowContext from "./OrderWindowContext";

function handleOrderWindow(state, item, callbackFn) {
  item.minQty = Utils.getMinQty(item);
  item.qty = item.minQty;
  item.price = item.lastPrice;
  item.triggerPrice = item.lastPrice;
  callbackFn(state, item);
}

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
                    onClick={() =>
                      handleOrderWindow("B", item, orderWindowHandler)
                    }
                  >
                    B
                  </button>
                  <button
                    className="btn sell"
                    onClick={() =>
                      handleOrderWindow("S", item, orderWindowHandler)
                    }
                  >
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

class Watchlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      watchlist: [],
    };

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
          handleOrderWindow("B", this.state.watchlist[i], this.context);
        }
        break;
      }
      case 83: {
        //S
        if (selectedElement) {
          let i = 0;
          let child = selectedElement;
          while ((child = child.previousSibling) != null) i++;
          handleOrderWindow("S", this.state.watchlist[i], this.context);
        }
        break;
      }
      default:
        break;
    }
  }

  componentDidMount() {
    this.getWatchlists();
  }

  componentDidUpdate(prevProps) {
    if (this.props.name === prevProps.name) {
      return;
    }
    this.getWatchlists();
  }

  getWatchlists() {
    fetch("/api/watchlists/byName?name=" + this.props.name)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            watchlist: result.Success,
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

  render() {
    const { error, isLoaded, watchlist } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <table className="table table-hover table-dark">
          <tbody tabIndex="2" onKeyDown={this.handleKeyDown} autoFocus={true}>
            {watchlist.map((value, index) => (
              <WatchlistItem key={index} value={value} />
            ))}
          </tbody>
        </table>
      );
    }
  }
}
Watchlist.contextType = OrderWindowContext;

class WatchlistGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      watchlists: [],
      watchlistName: "",
    };
    this.onWatchlistChange = this.onWatchlistChange.bind(this);
  }

  componentDidMount() {
    fetch("/api/watchlists")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            watchlists: result.Success,
            watchlistName: result.Success[0].watchlistName,
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

  onWatchlistChange(event) {
    const name = event.currentTarget.id;
    this.setState({ watchlistName: name });
  }

  render() {
    const { error, isLoaded, watchlists, watchlistName } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="watchlist-group">
          {/* <div className="row">
            <div className="col">
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                name="scrip-search-bar"
              />
            </div>
          </div> */}
          <div className="instruments">
            <Watchlist name={watchlistName} />
          </div>
          <ul className="watchlist-selector list-flat">
            {watchlists.map((value) => (
              <li
                onClick={this.onWatchlistChange}
                className={
                  this.state.watchlistName === value.watchlistName
                    ? "selected"
                    : ""
                }
                key={value.watchlistName}
                id={value.watchlistName}
              >
                {value.watchlistName}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default WatchlistGroup;
