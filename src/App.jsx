import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import AdminDashboard from "./components/AdminDashboard";
import AnalyticsPanel from "./components/AnalyticsPanel";
import { getReports, saveReports } from "./utils/storage";
import { Col, Row, message, Input, Button, Card, Tag } from "antd";
import loginImage from "./assets/login.jpeg";

function App() {
  const [reports, setReports] = useState(getReports());
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [view, setView] = useState("reports");
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedUser")) || null;
  });

  const [messageApi, contextHolder] = message.useMessage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleMapClick = (lng, lat) => {
    setSelectedCoords({ lng, lat });
  };

  const addReport = (data) => {
    if (!selectedCoords) {
      messageApi.warning("Click a location on the map first!");
      return;
    }

    const newReport = {
      ...data,
      ...selectedCoords,
      status: "Pending",
      timestamp: new Date().toLocaleString(),
    };

    const updated = [...reports, newReport];
    setReports(updated);
    saveReports(updated);
    messageApi.success("Report submitted successfully!");
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...reports];
    updated[index].status = newStatus;
    setReports(updated);
    saveReports(updated);
  };

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      const adminUser = { role: "admin", name: "Admin" };
      setUser(adminUser);
      localStorage.setItem("loggedUser", JSON.stringify(adminUser));
      messageApi.success("Welcome, Admin!");
    } else if (username.trim() && password === "lakshita@123") {
      const normalUser = { role: "user", name: username };
      setUser(normalUser);
      localStorage.setItem("loggedUser", JSON.stringify(normalUser));
      messageApi.success(`Welcome, ${username}!`);
    } else {
      messageApi.error("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
    messageApi.info("Logged out successfully");
  };

  /* ---------------- LOGIN VIEW ---------------- */

 if (!user) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        background: `
          linear-gradient(
            135deg,
            rgba(27, 67, 50, 0.85),
            rgba(45, 106, 79, 0.75)
          ),
          url(${loginImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {contextHolder}

      <Card
        style={{
          width: 430,
          padding: "40px 35px",
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.4)",
          transition: "0.3s ease",
        }}
        hoverable
      >
        {/* Logo Section */}
        <div style={{ marginBottom: "25px" }}>
          <h1
            style={{
              color: "#1b4332",
              marginBottom: "5px",
              fontWeight: "700",
              fontSize: "28px",
            }}
          >
            ♻ Smart Waste
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            Smart Management Portal
          </p>
        </div>

        {/* Inputs */}
        <Input
          size="large"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            marginBottom: "18px",
            borderRadius: "12px",
            height: "45px",
          }}
        />

        <Input.Password
          size="large"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginBottom: "25px",
            borderRadius: "12px",
            height: "45px",
          }}
        />

        {/* Button */}
        <Button
          type="primary"
          size="large"
          block
          onClick={handleLogin}
          style={{
            background: "linear-gradient(135deg, #2d6a4f, #40916c)",
            border: "none",
            borderRadius: "12px",
            height: "48px",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 10px 25px rgba(45,106,79,0.4)",
            transition: "0.3s ease",
          }}
        >
          Login
        </Button>

        {/* Footer */}
        <div
          style={{
            marginTop: "25px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          © 2026 Smart Waste System
        </div>
      </Card>
    </div>
  );
}


  /* ---------------- MAIN APP ---------------- */

  return (
    <div
      style={{
        minHeight: "90vh",
        minWidth:"97vw",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8f4)",
        paddingBottom: "40px",
      }}
    >
      {contextHolder}

      {/* HEADER */}
      <div
        style={{
          padding: "20px 40px",
          background: "#ffffffcc",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ margin: 0, color: "#1b4332" }}>
          ♻️ smart waste App
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Tag color="green">{user.role.toUpperCase()}</Tag>
          <span>
            Welcome, <strong>{user.name}</strong>
          </span>
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        {(user.role === "admin"
          ? ["admin", "analytics", "reports"]
          : ["user", "analytics", "reports"]
        ).map((tab) => (
          <Button
            key={tab}
            type={view === tab ? "primary" : "default"}
            onClick={() => setView(tab)}
            style={{
              margin: "0 10px",
              borderRadius: "20px",
              padding: "0 25px",
              backgroundColor: view === tab ? "#2d6a4f" : "",
              borderColor: "#2d6a4f",
              color: view === tab ? "#fff" : "#2d6a4f",
              fontWeight: "500",
            }}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* MAIN GRID */}
      <div style={{ padding: "0 40px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                height: "600px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <MapView
                reports={reports}
                onMapClick={view === "user" ? handleMapClick : null}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: "20px",
                height: "600px",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              }}
            >
              {view === "admin" && (
                <AdminDashboard reports={reports} onUpdate={updateStatus} />
              )}
              {view === "user" && <ReportForm onSubmit={addReport} />}
              {view === "analytics" && (
                <AnalyticsPanel reports={reports} />
              )}
              {view === "reports" && <ReportList reports={reports} />}
            </Card>
          </Col>
        </Row>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "60px",
          textAlign: "center",
          color: "#666",
          fontWeight: "500",
        }}
      >
        Made with 💚 by Lakshita Pandey
      </div>
    </div>
  );
}

export default App;
