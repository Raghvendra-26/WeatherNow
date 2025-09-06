import React from "react";
import apiKeys from "./apiKeys";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

// Format today’s date into a nice string (e.g., Monday, 6 September 2025)
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

// Default settings for weather icons
const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  // Initial state values
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    // Try to get user's location
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          // If allowed → fetch weather for current location
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          // If denied → show default location (Jaipur's coordinates here)
          this.getWeather(26.9124, 75.7873);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    // Refresh weather every 10 minutes
    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    // Clear interval when component unmounts
    clearInterval(this.timerID);
  }

  // Wrap geolocation in a Promise for easier async/await usage
  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  // Fetch weather data from OpenWeather API
  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();

    // Save weather info in state
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      // sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),
      // sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
    });

    // Pick correct icon based on weather type
    switch (this.state.main) {
      case "Haze":
        this.setState({ icon: "CLEAR_DAY" });
        break;
      case "Clouds":
        this.setState({ icon: "CLOUDY" });
        break;
      case "Rain":
        this.setState({ icon: "RAIN" });
        break;
      case "Snow":
        this.setState({ icon: "SNOW" });
        break;
      case "Dust":
        this.setState({ icon: "WIND" });
        break;
      case "Drizzle":
        this.setState({ icon: "SLEET" });
        break;
      case "Fog":
        this.setState({ icon: "FOG" });
        break;
      case "Smoke":
        this.setState({ icon: "FOG" });
        break;
      case "Tornado":
        this.setState({ icon: "WIND" });
        break;
      default:
        this.setState({ icon: "CLEAR_DAY" });
    }
  };

  render() {
    // If we have weather data → show it
    if (this.state.temperatureC) {
      return (
        <React.Fragment>
          {/* City name and country */}
          <div className="city">
            <div className="title">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>

            {/* Weather icon with description */}
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div>

            {/* Temperature display */}
            <div className="date-time">
              <div className="temperature">
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
                {/* Fahrenheit can be shown if needed */}
                {/* <span className="slash">/</span>
                {this.state.temperatureF} &deg;F */}
              </div>
            </div>
          </div>

          {/* Forecast component for more detailed weather */}
          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    }
    // Otherwise → show loader until we get location/weather
    else {
      return (
        <React.Fragment>
          {/* Loading spinner */}
          <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />

          {/* Message while waiting */}
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App <br /> & used for
            calculating real-time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;