import React from "react";
import Positions from "./Positions";

class PositionBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      positions: []
    };
  }

  componentDidMount() {
    fetch("/api/positions")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            positions: result
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
    const { error, isLoaded, positions } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let todays_position = positions["todays"].filter(
        (position) => position.buyTradedQtyLot !== 0 && position.sellTradedQtyLot !== 0
      );
      let open_position = positions["todays"].filter(
        (position) => position.buyTradedQtyLot !== position.sellTradedQtyLot
      );

      return (
        <div className="position-window">
          <div className="row open-positions">
            <div>
              <h5>Open Positions ({open_position.length})</h5>
            </div>
            <Positions positions={open_position} />
          </div>

          <div className="row todays-positions">
            <div>
              <h5>Today&apos;s Positions ({todays_position.length})</h5>
            </div>
            <Positions positions={todays_position} />
          </div>
        </div>
      );
    }
  }
}

export default PositionBook;
