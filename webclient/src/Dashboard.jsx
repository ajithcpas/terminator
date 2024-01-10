import React from "react";
import Utils from "./utils/utils";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalMargin: 0,
      marginAvailable: 0,
      marginUtilised: 0
    };
  }

  componentDidMount() {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(
        (result) => {
          let totalMargin = result.Success.derivatives[0].options.totalMargin;
          let marginAvailable = result.Success.derivatives[0].options.marginAvailable;
          let marginUtilised = result.Success.derivatives[0].options.marginUtilised;
          this.setState({
            isLoaded: true,
            totalMargin: totalMargin,
            marginAvailable: marginAvailable,
            marginUtilised: marginUtilised
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

  render() {
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col primary-stats">
            <div className="value">{Utils.parseFloat(this.state.marginAvailable)}</div>
            <div className="label">Margin available</div>
          </div>
          <div className="col secondary-stats">
            <div className="block">
              <span className="label">Margins used</span>
              <span className="value">{Utils.parseFloat(this.state.marginUtilised)}</span>
            </div>
            <div className="block">
              <span className="label">Opening balance</span>
              <span className="value">{Utils.parseFloat(this.state.totalMargin)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
