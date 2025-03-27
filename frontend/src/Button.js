import React from "react";
import "./Button.css"; // Optional: Style your buttons here

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
