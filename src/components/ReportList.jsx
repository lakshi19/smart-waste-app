import React from "react";
import { Tag } from "antd";

const ReportList = ({ reports }) => {
  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "15px", color: "#1b4332" }}>
        📋 Submitted Reports
      </h3>

      {reports.length === 0 && (
        <p style={{ color: "#888" }}>No reports available.</p>
      )}

      {reports.map((r, i) => {
        const getStatusColor = () => {
          if (r.status === "Resolved") return "green";
          if (r.status === "Pending") return "red";
          return "orange";
        };

        return (
          <div
            key={i}
            style={{
              borderRadius: "16px",
              padding: "15px",
              marginBottom: "15px",
              background: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              transition: "0.3s ease",
              border: "1px solid #f0f0f0",
            }}
          >
            <p style={{ margin: "4px 0" }}>
              <strong>Name:</strong> {r.name}
            </p>

            <p
              style={{
                margin: "6px 0",
                wordBreak: "break-word",
                color: "#555",
              }}
            >
              <strong>{r.issueType}:</strong> {r.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Tag color={getStatusColor()}>{r.status}</Tag>

              <span style={{ fontSize: "12px", opacity: 0.6 }}>
                {r?.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportList;
