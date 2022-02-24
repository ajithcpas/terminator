import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./App.css";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer, Toast } from "react-bootstrap";
import WatchlistGroup from "./watchlists/WatchlistGroup";
import OrderWindow from "./orders/OrderWindow";
import OrderWindowContext from "./orders/OrderWindowContext";
import ToastContext from "./utils/ToastContext";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderWindowState: {
        show: false
      },

      orderWindowHandler: (state, data) => {
        this.setState({
          orderWindowState: {
            show: true,
            state: state,
            data: data
          }
        });
      },

      user_id: "User",

      toasts: [],
      onToastClose: (id) => {
        const toasts = this.state.toasts.filter((toast) => toast.id !== id);
        this.setState({ toasts: toasts });
      },
      toastHandler: (data) => {
        let toast = {
          id: Date.now(),
          title: data.title,
          message: data.message,
          status: data.status
        };
        const toasts = this.state.toasts.concat(toast);
        this.setState({ toasts: toasts });
      }
    };
  }

  render() {
    return (
      <div className="app container-fluid">
        <div className="row app-header">
          <div className="lhs col-md-4"></div>
          <div className="rhs col-md-8 text-end">
            <div className="app-nav">
              <NavLink to="/dashboard">Dashboard</NavLink>
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
                    {this.state.toasts.map((toast) => (
                      <Toast
                        onClose={() => this.state.onToastClose(toast.id)}
                        bg="dark"
                        className={toast.status}
                        key={toast.id}
                        delay={10000}
                        autohide>
                        <Toast.Header>
                          <strong>{toast.title}</strong>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                      </Toast>
                    ))}
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
