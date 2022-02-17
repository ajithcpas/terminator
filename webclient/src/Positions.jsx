import React from "react";
import Utils from "./utils";

class Positions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const positions = this.props.positions;
    const totalPnL = positions.reduce(
      (prev, curr) => prev + curr.realizedPL,
      0
    );

    return (
      <table className="table table-hover table-dark">
        <thead>
          <tr>
            <th scope="col">Instrument</th>
            <th scope="col" className="text-end">
              Qty.
            </th>
            <th scope="col" className="text-end">
              Avg.price
            </th>
            <th scope="col" className="text-end">
              P&L
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((value, index) => (
            <tr key={index}>
              <td>{Utils.getInstrumentName(value)}</td>
              <td className="text-end">
                {value.netTrdQtyLot !== 0
                  ? value.netTrdQtyLot
                  : value.buyTradedQtyLot}
              </td>
              <td className="text-end">
                {value.netTrdQtyLot !== 0
                  ? value.averageStockPrice
                  : value.buyTrdAvg}
              </td>
              <td className="text-end">
                <span
                  className={value.realizedPL > 0 ? "profit-text" : "loss-text"}
                >
                  {value.realizedPL}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              Total
            </td>
            <td className="text-end">
              <span className={totalPnL > 0 ? "profit-text" : "loss-text"}>
                {totalPnL}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

class PositionBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      positions: [],
    };
  }

  componentDidMount() {
    fetch("/api/positions")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            positions: result,
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
    const { error, isLoaded, positions } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let todays_position = positions["todays"].filter(
        (position) =>
          position.buyTradedQtyLot !== 0 && position.sellTradedQtyLot !== 0
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
              <h5>Todays Positions ({todays_position.length})</h5>
            </div>
            <Positions positions={todays_position} />
          </div>
        </div>
      );
    }
  }
}

export default PositionBook;
