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

const COLORS = ["#2d6a4f", "#918940", "#74bcc6", "#ff1cd9"];

const AnalyticsPanel = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <div style={{ padding: "10px" }}>
        <h3 style={{ color: "#1b4332" }}>📊 Analytics Dashboard</h3>
        <p style={{ marginTop: "15px", color: "#888" }}>
          No data available yet. Submit some reports first!
        </p>
      </div>
    );
  }

  const statusCounts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const issueCounts = reports.reduce((acc, r) => {
    acc[r.issueType] = (acc[r.issueType] || 0) + 1;
    return acc;
  }, {});

  const issueData = Object.entries(issueCounts).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "20px", color: "#1b4332" }}>
        📊 Analytics Dashboard
      </h3>

      {/* Status Pie Chart */}
      <div
        style={{
          height: "300px",
          marginBottom: "40px",
          background: "#ffffff",
          padding: "15px",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h4 style={{ marginBottom: "10px", color: "#2d6a4f" }}>
          Report Status Distribution
        </h4>

        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
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

      {/* Issue Bar Chart */}
      <div
        style={{
          height: "300px",
          background: "#ffffff",
          padding: "15px",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h4 style={{ marginBottom: "10px", color: "#2d6a4f" }}>
          Reports by Issue Type
        </h4>

        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={issueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#40916c"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
