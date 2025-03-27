import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import Card from "./Card";
import { WiSolarEclipse, WiHumidity, WiThermometer, WiBarometer } from "react-icons/wi";
import { FaSeedling, FaWater, FaGasPump } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    solarPower: 0,
    soilMoisture1: 0,
    soilMoisture2: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    gas: 0,
    pumpPower: 0,
    dripperPower: 0,
  });

  const [button1State, setButton1State] = useState(false);
  const [button2State, setButton2State] = useState(false);

  // Fetch data for each sensor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          "temperature", "humidity", "gas", "pressure",
          "solarPower", "soilMoisture1", "soilMoisture2",
          "pumpPower", "dripperPower"
        ];
        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios.get(`https://green-house-server-53a4.onrender.com/${endpoint}`)
          )
        );

        setData({
          temperature: responses[0].data.temperature,
          humidity: responses[1].data.humidity,
          gas: responses[2].data.gas,
          pressure: responses[3].data.pressure,
          solarPower: responses[4].data.solarPower,
          soilMoisture1: responses[5].data.soilMoisture1,
          soilMoisture2: responses[6].data.soilMoisture2,
          pumpPower: responses[7].data.pumpPower,
          dripperPower: responses[8].data.dripperPower,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle Button 1 ON/OFF
  const handleButton1 = async (state) => {
    try {
      await axios.post("https://green-house-server-53a4.onrender.com/buttons", { button: 1, state: state });
      setButton1State(state);
    } catch (error) {
      console.error("Error sending button1 state:", error);
    }
  };

  // Handle Button 2 ON/OFF
  const handleButton2 = async (state) => {
    try {
      await axios.post("https://green-house-server-53a4.onrender.com/buttons", { button: 2, state: state });
      setButton2State(state);
    } catch (error) {
      console.error("Error sending button2 state:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="text-center">
        <h1 className="title">Greenhouse Monitoring Dashboard</h1>
        <div className="header-background">
          <img src="/images/team.jpg" alt="Greenhouse" className="header-image" />
        </div>
      </header>

      <section>
        <h2 className="section-title">BME680 Values:</h2>
        <div className="grid-container">
          <Card title="Temperature" value={`${data.temperature} °C`} icon={<WiThermometer size={50} />} />
          <Card title="Humidity" value={`${data.humidity} %`} icon={<WiHumidity size={50} />} />
          <Card title="Pressure" value={`${data.pressure} hPa`} icon={<WiBarometer size={50} />} />
          <Card title="Gas" value={`${data.gas} ppm`} icon={<FaGasPump size={50} />} />
        </div>
      </section>

      <section>
        <h2 className="section-title">Soil Moisture Data:</h2>
        <div className="grid-container">
          <Card title="Soil Moisture 1" value={`${data.soilMoisture1} %`} icon={<FaSeedling size={50} />} />
          <Card title="Soil Moisture 2" value={`${data.soilMoisture2} %`} icon={<FaSeedling size={50} />} />
        </div>
      </section>

      <section>
        <h2 className="section-title">Solar Energy Data:</h2>
        <div className="grid-container">
          <Card title="Solar Power" value={`${data.solarPower} W`} icon={<WiSolarEclipse size={50} />} />
          <Card title="Pump Power" value={`${data.pumpPower} W`} icon={<FaWater size={50} />} />
          <Card title="Dripper Power" value={`${data.dripperPower} W`} icon={<FaWater size={50} />} />
        </div>
      </section>

      <div className="button-container">
        <Button onClick={() => handleButton1(!button1State)}>
          {button1State ? "Turn Off Button 1" : "Turn On Button 1"}
        </Button>
        <Button onClick={() => handleButton2(!button2State)}>
          {button2State ? "Turn Off Button 2" : "Turn On Button 2"}
        </Button>
      </div>
    </div>
  );
};

export default App;
