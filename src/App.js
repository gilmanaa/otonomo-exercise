import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import createStreamerFrom from './api/streamer'
import generateCarData from './api/data-generator'
import createCarStreamer from './api/car-data-streamer'
import Input from './components/Input'
import Button from './components/Button'
import EventNotification from './components/EventNotification'
import Checkbox from './components/Checkbox'

class App extends Component {
  streamer = createStreamerFrom(() => generateCarData('12345678901234567'))

  state = {
    carData: {},
    fuelFilter: false,
    vinTracking: this.vinTracking,
    eventTracking: this.eventTracking,
  }

  newCarStreamer = this.newCarStreamer.bind(this)
  toggleEvents = this.toggleEvents.bind(this)
  filterFuelLevel = this.filterFuelLevel.bind(this)
  vinTracking = []
  eventTracking = []
  fuelFilterTracking = []

  newCarStreamer() {
    let vin = this.input.value
    this.input.value = ''
    const carStreamer = createCarStreamer(vin)
    this.vinTracking.push(
      <Checkbox
        children={vin}
        toggle={this.toggleEvents}
        streamer={carStreamer}
        key={vin}
        dfcheck={true}
      />,
    )
    this.setState({ vinTracking: this.vinTracking })
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
      eventTracking: this.eventTracking,
    })
  }
  componentDidMount() {
    this.streamer.subscribe(this.updateState)
    this.streamer.start()
  }

  render() {
    let vins = this.state.vinTracking.length > 0 ? this.state.vinTracking : null
    let fuelFilterShow =
      this.eventTracking.length > 0 ? (
        <Checkbox
          children="Filter events where fuel level is under 15%"
          toggle={this.filterFuelLevel}
          dfcheck={false}
        />
      ) : null
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
            {JSON.stringify(this.state.carData)}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a> */}
          <Input vin={x => (this.input = x)} />
          <Button add={this.newCarStreamer} />
          {JSON.stringify(this.state.carData)}
          <div>{fuelFilterShow}</div>
          <div style={{ height: '50vh', overflowY: 'auto' }}>
            {this.state.eventTracking}
          </div>
          <div>{vins}</div>
        </header>
      </div>
    )
  }
}

export default App
