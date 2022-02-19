import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./App.css";
import WatchlistGroup from "./Watchlist";
import { NavLink, Outlet } from "react-router-dom";
import OrderWindow from "./OrderWindow";
import React from "react";
import OrderWindowContext from "./OrderWindowContext";
import { ToastContainer, Toast } from "react-bootstrap";
import ToastContext from "./ToastContext";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderWindowState: {
        show: false,
      },

      orderWindowHandler: (state, data) => {
        this.setState({
          orderWindowState: {
            show: true,
            state: state,
            data: data,
          },
        });
      },

      user_id: "User",

      toast: {
        show: false,
        title: "",
        message: "",
        status: "",
      },
      onToastClose: () => {
        this.setState({ toast: { show: false } });
      },
      toastHandler: (data) => {
        this.setState({
          toast: {
            show: true,
            title: data.title,
            message: data.message,
            status: data.status,
          },
        });
      },
    };
  }

  render() {
    return (
      <div className="app container-fluid">
        <div className="row app-header">
          <div className="lhs col-md-4"></div>
          <div className="rhs col-md-8 text-end">
            <div className="app-nav">
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/positions">Positions</NavLink>
            </div>
            <div className="right-nav">
              <div className="user-nav">
                <span>{this.state.user_id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row app-section">
          <ToastContext.Provider value={this.state.toastHandler}>
            <OrderWindowContext.Provider value={this.state.orderWindowHandler}>
              <div className="lhs col-md-4">
                <WatchlistGroup />
              </div>

              <div className="rhs col-md-8">
                <div>
                  <Outlet />

                  <OrderWindow value={this.state.orderWindowState} />
                  <ToastContainer className="p-3" position="bottom-end">
                    <Toast
                      show={this.state.toast.show}
                      onClose={this.state.onToastClose}
                      bg="dark"
                    >
                      <Toast.Header>
                        <strong>{this.state.toast.title}</strong>
                      </Toast.Header>
                      <Toast.Body className="text-white">
                        {this.state.toast.message}
                      </Toast.Body>
                    </Toast>
                  </ToastContainer>
                </div>
              </div>
            </OrderWindowContext.Provider>
          </ToastContext.Provider>
        </div>
      </div>
    );
  }
}

export default App;
