import React from "react";

const AdminDashboard = ({ reports, onUpdate }) => {
  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "15px", color: "#1b4332" }}>
        Admin View
      </h3>

      {reports.length === 0 && (
        <p style={{ color: "#888" }}>No reports submitted yet.</p>
      )}

      {reports.map((r, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            background: "#fff",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p style={{ margin: "4px 0" }}>
            <b>Name:</b> {r.name}
          </p>

          <p style={{ margin: "4px 0", wordBreak: "break-word" }}>
            <b>{r.issueType}:</b> {r.description}
          </p>

          <p style={{ margin: "6px 0" }}>
            <b>Status:</b>{" "}
            <select
              value={r.status}
              onChange={(e) => onUpdate(i, e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </p>

          <p
            style={{
              fontSize: "12px",
              opacity: 0.6,
              textAlign: "right",
              margin: 0,
            }}
          >
            {r?.timestamp}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
