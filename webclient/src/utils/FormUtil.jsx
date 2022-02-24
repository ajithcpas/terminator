import React from "react";
import Utils from "./utils";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minValue: Utils.parseFloat(this.props.minValue),
      value: this.props.value
        ? Utils.parseFloat(this.props.value)
        : Utils.parseFloat(this.props.minValue)
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.name, e.target.value);
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 38: {
        //up arrow
        let minValue = this.state.minValue;
        let value = minValue;
        if (this.state.value && Utils.parseFloat(this.state.value) >= minValue) {
          value = Utils.parseFloat(this.state.value) + minValue;
        }
        value = Utils.parseFloat(value);
        this.setState({ value: value });
        this.props.onChange(e.target.name, value);
        e.preventDefault();
        break;
      }

      case 40: {
        //down arrow
        let minValue = this.state.minValue;
        let value = minValue;
        if (this.state.value && Utils.parseFloat(this.state.value) > minValue) {
          value = Utils.parseFloat(this.state.value) - minValue;
        }
        value = Utils.parseFloat(value);
        this.setState({ value: value });
        this.props.onChange(e.target.name, value);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
    this.setState({ value: this.props.value, minValue: this.props.minValue });
  }

  render() {
    return (
      <div className="input-group">
        <label className="input-label">{this.props.label}</label>
        <input
          type={this.props.type}
          className={this.props.className}
          name={this.props.name}
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          autoFocus={this.props.autoFocus}
        />
      </div>
    );
  }
}

export default Input;
