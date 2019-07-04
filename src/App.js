import React, { Component } from 'react'
import './App.css'
import createCarStreamer from './api/car-data-streamer'
import Input from './components/Input'
import Button from './components/Button'
import EventNotification from './components/EventNotification'
import Checkbox from './components/Checkbox'

class App extends Component {

  state = {
    carData: {},
    fuelFilter: false,
    vinTracking: this.vinTracking,
    eventTracking: this.eventTracking,
    inputFeedback: "Please Enter a VIN"
  }

  newCarStreamer = this.newCarStreamer.bind(this)
  toggleEvents = this.toggleEvents.bind(this)
  filterFuelLevel = this.filterFuelLevel.bind(this)
  vinTracking = []
  eventTracking = []
  fuelFilterTracking = []
  vinInputCheck = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

  newCarStreamerInput(vin) {
    if (vin.length !== 17) {
      this.setState({ inputFeedback: `Invalid VIN: Incorrect Length, 17 Characters Needed ${vin.length} Entered` })
      return true
    }
    for (let i = 0; i < vin.length; i++) {
      if (this.vinInputCheck.indexOf(vin[i]) === -1) {
        this.setState({ inputFeedback: "Invalid VIN: Uppercase Alphanumeric Characters Needed" })
        return true
      }
    }
    if (this.vinTracking.findIndex(x => x.key === vin) !== -1) {
      this.setState({ inputFeedback: `Already Tracking Events for ${vin}` })
      return true
    }
  }
  newCarStreamer() {
    let vin = this.input.value
    if (this.newCarStreamerInput(vin)) {
      return
    }
    this.input.value = ''
    const carStreamer = createCarStreamer(vin)
    this.vinTracking.push(
      <Checkbox
        children={vin}
        toggle={this.toggleEvents}
        streamer={carStreamer}
        key={vin}
        dfcheck={true}
        checkstyle="checkboxs"
      />,
    )
    this.setState({ vinTracking: this.vinTracking, inputFeedback: `Successful Event Tracking Started for ${vin}` })
    carStreamer.subscribe(this.updateState)
    carStreamer.start()
  }
  toggleEvents(event) {
    let vin = event.target.parentElement.innerText
    let findStreamer = this.vinTracking.findIndex(x => x.key === vin)
    let toggleEvents = this.vinTracking[findStreamer].props.streamer.isStreaming
    toggleEvents
      ? this.vinTracking[findStreamer].props.streamer.stop()
      : this.vinTracking[findStreamer].props.streamer.start()
  }
  filterFuelLevel() {
    let tracking = this.state.fuelFilter
      ? this.eventTracking
      : this.fuelFilterTracking
    this.setState({
      fuelFilter: !this.state.fuelFilter,
      eventTracking: tracking,
    })
  }

  updateState = carData => {
    this.eventTracking.push(
      <EventNotification
        carEvent={carData}
        key={`${carData.vin} ${carData.timestamp}`}
      />,
    )
    if (parseFloat(carData.fuel) < 0.15) {
      this.fuelFilterTracking.push(
        <EventNotification
          carEvent={carData}
          key={`${carData.vin} ${carData.timestamp} filter`}
        />,
      )
    }
    this.setState({ carData })
  }

  componentWillMount() {
    this.setState({
      vinTracking: this.vinTracking,
      eventTracking: this.eventTracking
    })
  }

  render() {
    let vins = this.state.vinTracking.length > 0 ? this.state.vinTracking : null
    let watchlist = this.state.vinTracking.length > 0 ? "Watch List:" : null
    let fuelFilterShow =
      this.eventTracking.length > 0 ? (
        <Checkbox
          children="Filter events where fuel level is under 15%"
          toggle={this.filterFuelLevel}
          dfcheck={false}
          checkstyle="checkboxs checkbox-adjust"
        />
      ) : null
    return (
      <div className="App">
        <header className="App-header">
          <div className="vin-tracking">
            <Input vin={x => (this.input = x)} />
            <Button add={this.newCarStreamer} />
            <div className="input-feedback">{this.state.inputFeedback}</div>
            <div className="watchlist">{watchlist}</div>
            <div className="vin-wrapper">{vins}</div>
          </div>
          <div className="event-tracking-container">
            <div className="filter-button">{fuelFilterShow}</div>
            <div className="event-tracking">
              {this.state.eventTracking}
            </div>
          </div>
        </header>
      </div>
    )
  }
}

export default App
