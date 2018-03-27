import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div
        style={{
          width: "610px",
          border: "1px solid black",
          borderRadius: "20px",
          backgroundColor: "#f6f8fa",
          textAlign: "center"
        }}
      >
        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
          <h2 style={{ color: "#0366d6" }}>Lottery Contract</h2>
          <p>
            This contract is managed by{" "}
            <label id="manager">{this.state.manager}</label>.
          </p>
          <p>
            There are currently{" "}
            <label id="playersLenght">{this.state.players.length}</label> people
            entered, competing to win{" "}
            <label id="balance">
              {web3.utils.fromWei(this.state.balance, "ether")}
            </label>{" "}
            ether!
          </p>

          <hr />

          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter => </label>
              <input
                style={{ width: "40px" }}
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <br />
            <button className="button" id="enter">
              Enter
            </button>
            <br />
            <br />
          </form>

          <hr />

          <h4>Ready to pick a winner?</h4>
          <button className="button" onClick={this.onClick}>
            Pick a Winner!
          </button>

          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  }
}

export default App;
