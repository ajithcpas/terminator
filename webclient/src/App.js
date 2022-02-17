import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./App.css";
import WatchlistGroup from "./Watchlist";
import { NavLink, Outlet } from "react-router-dom";
import OrderWindow from "./OrderWindow";
import React from "react";
import OrderWindowContext from "./OrderWindowContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orderWindowHandler = (state, data) => {
      this.setState({
        orderWindowState: {
          show: true,
          state: state,
          data: data,
        },
      });
    };

    this.state = {
      orderWindowState: {
        show: false,
      },
      orderWindowHandler: this.orderWindowHandler,
    };
  }

  render() {
    return (
      <div className="app container-fluid">
        <div className="row app-header">
          <div className="lhs col-md-4"></div>
          <div className="rhs col-md-8">
            <div className="app-nav">
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/positions">Positions</NavLink>
            </div>
          </div>
        </div>

        <div className="row app-section">
          <OrderWindowContext.Provider value={this.state.orderWindowHandler}>
            <div className="lhs col-md-4">
              <WatchlistGroup />
            </div>

            <div className="rhs col-md-8">
              <div>
                <Outlet />

                <OrderWindow value={this.state.orderWindowState} />
              </div>
            </div>
          </OrderWindowContext.Provider>
        </div>
      </div>
    );
  }
}

export default App;