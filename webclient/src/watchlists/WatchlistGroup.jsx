import React from "react";
import Watchlist from "./Watchlist";

class WatchlistGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      watchlists: [],
      watchlistName: "",
      watchlistItems: []
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
            watchlistItems: result.Success[0].watchlistItems
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
    const watchlistItems = this.state.watchlists.filter((x) => x.watchlistName === name)[0]
      .watchlistItems;
    this.setState({ watchlistName: name, watchlistItems: watchlistItems });
  }

  render() {
    const { error, isLoaded, watchlists, watchlistName, watchlistItems } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="watchlist-group">
          <div className="instruments">
            <Watchlist name={watchlistName} items={watchlistItems} />
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
