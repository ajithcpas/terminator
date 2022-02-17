import React from "react";

class HoverComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({ showActions: true });
  }

  handleMouseLeave() {
    this.setState({ showActions: false });
  }

  render() {
    return (
      <div className="hover-component"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.state.showActions ? this.props.children : null}
      </div>
    );
  }
}

export default HoverComponent;
