import { Card } from "antd";
import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"];

const AnalyticsPanel = ({ reports }) => {
  if (reports.length === 0)
    return <p>No data available yet. Submit some reports first!</p>;

  const statusCounts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const issueCounts = reports.reduce((acc, r) => {
    acc[r.issueType] = (acc[r.issueType] || 0) + 1;
    return acc;
  }, {});
  const issueData = Object.entries(issueCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <Card title={"📊 Analytics Dashboard"} style={{ height: "80vh" }}>
      <div style={{ marginTop: "20px" }}>
        <div style={{ height: "300px", marginTop: "20px", textAlign: "left" }}>
          <h4>Report Status Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: "300px", marginTop: "20px", textAlign: "left" }}>
          <h4>Reports by Issue Type</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={issueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsPanel;
