import React from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      {/* Main container that holds the weather app */}
      <div className="container">
        <CurrentLocation /> {/* Component that shows weather based on location */}
      </div>
    </React.Fragment>
  );
}

export default App; 