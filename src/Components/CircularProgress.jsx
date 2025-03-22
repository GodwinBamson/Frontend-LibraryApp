import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ progress, size = 120, color = "#4caf50", children }) => {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {/* Circular Progress Bar */}
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          textColor: "#000",
          pathColor: color,
          trailColor: "#d6d6d6",
        })}
      />
      

      {/* Custom Children (Centered Inside) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;
