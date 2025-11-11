import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import AdminDashboard from "./components/AdminDashboard";
import AnalyticsPanel from "./components/AnalyticsPanel";
import { getReports, saveReports } from "./utils/storage";
import { Col, Row, message, Input, Button, Card } from "antd";
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
  // useEffect(() => {
  //   const storedReports = getReports();
  //   setReports(storedReports);
  // }, []);
  const addReport = (data) => {
    if (!selectedCoords) {
      alert("click a location on the map first!");
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
    messageApi.open({
      type: "success",
      content: "report submitted successfully!",
    });
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
    } else if (username.trim() && password === "lakshita123") {
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
    messageApi.info("logged out successfully");
  };

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {" "}
        {contextHolder}
        <Card
          style={{
            width: 450,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            borderRadius: 10,
          }}
        >
          <h2>♻️ Smart Waste Management</h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            Please log in to continue
          </p>

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "15px" }}
          />

          <Button
            type="primary"
            block
            onClick={handleLogin}
            style={{
              background: "#4caf50",
              border: "none",
            }}
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>♻️ Smart Waste Management System</h2>
        <div>
          <span style={{ marginRight: "10px" }}>
            Logged in as <strong>{user.name}</strong> ({user.role})
          </span>
          <Button size="small" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        {user.role === "admin" && (
          <>
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("admin")}
            >
              Admin View
            </button>{" "}
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("analytics")}
            >
              Analytics View
            </button>{" "}
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("reports")}
            >
              Reports View
            </button>{" "}
          </>
        )}
        {user.role === "user" && (
          <>
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("user")}
            >
              User View
            </button>
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("analytics")}
            >
              Analytics View
            </button>{" "}
            <button
              style={{ border: "1px solid #a1a1a1" }}
              onClick={() => setView("reports")}
            >
              Reports View
            </button>{" "}
          </>
        )}
      </div>

      <div style={{ width: "95vw" }}>
        <Row>
          <Col md={16}>
            <MapView
              reports={reports}
              onMapClick={view === "user" ? handleMapClick : null}
            />
          </Col>
          <Col md={8}>
            {view === "admin" && (
              <AdminDashboard reports={reports} onUpdate={updateStatus} />
            )}
            {view === "user" && <ReportForm onSubmit={addReport} />}
            {view === "analytics" && <AnalyticsPanel reports={reports} />}
            {view === "reports" && <ReportList reports={reports} />}
          </Col>
        </Row>
      </div>
      <div
        style={{ position: "relative", textAlign: "center", marginTop: "20px" }}
      >
        Made with ❤️ by Lakshita pandey
      </div>
    </div>
  );
}

export default App;
