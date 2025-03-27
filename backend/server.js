const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MQTT Broker Configuration
const mqttClient = mqtt.connect("mqtt://34.29.202.158:1883"); // Replace with your MQTT broker's IP and port

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

// Store latest sensor values
const sensorData = {
  temperature: null,
  humidity: null,
  gas: null,
  pressure: null,
  soilMoisture1: null,
  soilMoisture2: null,
  solarPower: null,
  pumpPower: null,
  dripperPower: null,
};

// Subscribe to MQTT topics for sensor data
const topics = [
  "bme680/temp",
  "bme680/hum",
  "bme680/gas",
  "bme680/pres",
  "soil/sensor1",
  "soil/sensor2",
  "solar/power",
  "solar/pumppower",
  "solar/dripperPower",
];

mqttClient.subscribe(topics, (err) => {
  if (err) {
    console.error("Failed to subscribe to topics:", err);
  } else {
    console.log(`Subscribed to topics: ${topics.join(", ")}`);
  }
});

// Handle incoming MQTT messages and update sensorData
mqttClient.on("message", (topic, message) => {
  const value = parseFloat(message.toString());
  console.log(`Received message from topic "${topic}": ${value}`);
  switch (topic) {
    case "bme680/temp":
      sensorData.temperature = value;
      break;
    case "bme680/hum":
      sensorData.humidity = value;
      break;
    case "bme680/gas":
      sensorData.gas = value;
      break;
    case "bme680/pres":
      sensorData.pressure = value;
      break;
    case "soil/sensor1":
      sensorData.soilMoisture1 = value;
      break;
    case "soil/sensor2":
      sensorData.soilMoisture2 = value;
      break;
    case "solar/power":
      sensorData.solarPower = value;
      break;
    case "solar/pumppower":
      sensorData.pumpPower = value;
      break;
    case "solar/dripperpower":
      sensorData.dripperPower = value;
      break;
    default:
      console.warn(`Unrecognized topic: ${topic}`);
  }
});

// Endpoint to fetch the latest sensor values
app.get("/temperature", (req, res) => {
  res.json({ temperature: sensorData.temperature });
});

app.get("/humidity", (req, res) => {
  res.json({ humidity: sensorData.humidity });
});

app.get("/gas", (req, res) => {
  res.json({ gas: sensorData.gas });
});

app.get("/pressure", (req, res) => {
  res.json({ pressure: sensorData.pressure });
});

app.get("/soilMoisture1", (req, res) => {
  res.json({ soilMoisture1: sensorData.soilMoisture1 });
});

app.get("/soilMoisture2", (req, res) => {
  res.json({ soilMoisture2: sensorData.soilMoisture2 });
});

app.get("/solarPower", (req, res) => {
  res.json({ solarPower: sensorData.solarPower });
});

app.get("/pumpPower", (req, res) => {
  res.json({ pumpPower: sensorData.pumpPower });
});

app.get("/dripperPower", (req, res) => {
  res.json({ dripperPower: sensorData.dripperPower });
});

// Button endpoints (POST)
app.post("/buttons", (req, res) => {
  const { button, state } = req.body;
  const topic = button === 1 ? "control/button1" : "control/button2";
  const message = state ? "1" : "0";

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error(`Failed to publish to ${topic}:`, err);
      res.status(500).send(`Failed to send data to ${topic}`);
    } else {
      console.log(`Sent message to topic "${topic}": ${message}`);
      res.status(200).send(`Data sent to ${topic} successfully`);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
