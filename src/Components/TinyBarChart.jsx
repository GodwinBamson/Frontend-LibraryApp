import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TinyBarChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Bar dataKey="available" fill="#4caf50" name="Available" />
          {/* <Bar dataKey="remaining" fill="#4caf50" name="Remaining" /> */}
          <Bar dataKey="sold" fill="#f44336" name="Sold" /> {/* ✅ Ensure this is included */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;
