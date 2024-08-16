import React from "react";

// Function to wrap text into multiple lines
const wrapText = (text, maxWidth, fontSize) => {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (let word of words) {
    const testLine = line + word + " ";
    const testWidth = getTextWidth(testLine, fontSize);

    if (testWidth > maxWidth) {
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  return lines;
};

// Function to measure text width
const getTextWidth = (text, fontSize) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${fontSize} sans-serif`;
  return context.measureText(text).width;
};

const XAxisTick = ({ x, y, payload, fontSize = "12px" }) => {
  const maxWidth = 100; // Adjust as necessary
  const lines = wrapText(payload.value, maxWidth, fontSize);

  return (
    <g transform={`translate(${x},${y})`} style={{ textAnchor: "middle" }}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 15}
          dy={16}
          fontSize={fontSize}
          fill="#666"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export default XAxisTick;
