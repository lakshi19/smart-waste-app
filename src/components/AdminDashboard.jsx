import { Card } from "antd";
import React from "react";

const AdminDashboard = ({ reports, onUpdate }) => {
  console.log("reports", reports);
  return (
    <Card title={"Admin View"} style={{ height: "80vh", overflow: "scroll" }}>
      <div
        style={{
          textAlign: "left",

          padding: "20px",
          textWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        {reports.map((r, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "0px",
              paddingLeft: "5px",
              margin: "5px",
              boxShadow: "5px 5px 5px  rgba(110, 110, 110, 0.5)",
              textWrap: "wrap",
              boxSizing: "border-box",
            }}
          >
            <p style={{ margin: "1px" }}>
              <b>Name</b> - {r.name}
            </p>
            <p
              style={{
                margin: "1px",
                textWrap: "wrap",
                boxSizing: "border-box",
                wordBreak: "break-word",
              }}
            >
              <b>{r.issueType}</b> - {r.description}
            </p>
            <p
              style={{
                marginBottom: "5px",
                marginLeft: "1px",
                marginTop: "1px",
              }}
            >
              Status:{" "}
              <select
                value={r.status}
                onChange={(e) => onUpdate(i, e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </p>
            <p
              style={{
                opacity: "0.5",
                marginLeft: "1px",
                marginTop: "1px",
                textAlign: "right",
              }}
            >
              {r?.timestamp}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AdminDashboard;
