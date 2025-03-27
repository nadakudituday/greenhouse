import React from "react";
import "./Card.css"; // Optional: Style your cards here

const Card = ({ title, value, icon }) => {
  return (
    <div className="card">
      {icon}
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default Card;
