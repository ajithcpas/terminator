import React from "react";
import Watchlist from "./Watchlist";

class WatchlistGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      watchlists: [],
      watchlistName: ""
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
            watchlistName: result.Success[0].watchlistName
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
          <div className="instruments">
            <Watchlist name={watchlistName} />
          </div>
          <ul className="watchlist-selector list-flat">
            {watchlists.map((value) => (
              <li
                onClick={this.onWatchlistChange}
                className={this.state.watchlistName === value.watchlistName ? "selected" : ""}
                key={value.watchlistName}
                id={value.watchlistName}>
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
