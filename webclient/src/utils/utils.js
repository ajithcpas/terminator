class Utils {
  static getInstrumentName(response) {
    if ("isFNO" in response && response.isFNO === "Y") {
      return `${response.instrumentName} ${response.expiryDate} ${response.strikePrice} ${response.optionType}`;
    }
    if ("it" in response) {
      if (response.it === "EQ") {
        return response.symbol;
      } else if (response.it === "FI") {
        return `${response.symbol} ${response.expiryDate} FUT`;
      }
      return `${response.symbol} ${response.expiryDate} ${response.strikePrice} ${response.optionType}`;
    }
    if ("realizedPL" in response) {
      if (response.segment === "EQ") {
        return response.symbol;
      } else if (response.segment === "FI") {
        return `${response.symbol} ${response.expiryDate} FUT`;
      }
      return `${response.symbol} ${response.expiryDate} ${response.strikePrice} ${response.optionType}`;
    }

    return response.instrumentName;
  }

  static getMinQty(response) {
    if (response.symbol === "NIFTY") {
      return 50;
    }
    if (response.symbol === "BANKNIFTY") {
      return 25;
    }
    return 1;
  }

  static parseFloat(num, decimal = 2) {
    return parseFloat(parseFloat(num).toFixed(decimal));
  }
}

export default Utils;
