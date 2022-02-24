import React from "react";
import Utils from "../utils/utils";

class Positions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const positions = this.props.positions;
    const totalPnL = positions.reduce((prev, curr) => prev + Utils.parseFloat(curr.realizedPL), 0);

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
              P&amp;L
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((value, index) => (
            <tr key={index}>
              <td>{Utils.getInstrumentName(value)}</td>
              <td className="text-end">
                {value.netTrdQtyLot !== 0 ? value.netTrdQtyLot : value.buyTradedQtyLot}
              </td>
              <td className="text-end">
                {value.netTrdQtyLot !== 0
                  ? Utils.parseFloat(value.averageStockPrice)
                  : Utils.parseFloat(value.buyTrdAvg)}
              </td>
              <td className="text-end">
                <span className={value.realizedPL > 0 ? "profit-text" : "loss-text"}>
                  {Utils.parseFloat(value.realizedPL)}
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
              <span className={totalPnL > 0 ? "profit-text" : "loss-text"}>{totalPnL}</span>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default Positions;
