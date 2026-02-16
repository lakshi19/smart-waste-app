import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { message } from "antd";

import successMarker from "../assets/successMarker.png";
import locationMarker from "../assets/locationMarker.png";
import selectedLocationMarker from "../assets/selectedLocationMarker.png";
import locationMarkerOrange from "../assets/locationMarkerOrange.png";

const MapView = ({ reports = [], onMapClick }) => {
  const mapRef = useRef();
  const [mapObj, setMapObj] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const clickMarkerSource = useRef(new VectorSource());

  useEffect(() => {
    const reportSource = new VectorSource();

    reports.forEach((r) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([r.lng, r.lat])),
        reportData: r,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src:
              r.status === "Resolved"
                ? successMarker
                : r.status === "Pending"
                ? locationMarker
                : locationMarkerOrange,
            scale: 0.06,
          }),
        })
      );

      reportSource.addFeature(feature);
    });

    const reportLayer = new VectorLayer({ source: reportSource });
    const clickMarkerLayer = new VectorLayer({
      source: clickMarkerSource.current,
    });

    // Simple Tooltip
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "#2d6a4f";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "12px";
    tooltip.style.display = "none";

    const overlay = new Overlay({
      element: tooltip,
      offset: [10, 0],
      positioning: "bottom-left",
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        reportLayer,
        clickMarkerLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([77.1025, 28.7041]),
        zoom: 11,
      }),
    });

    map.on("pointermove", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (feature && feature.get("reportData")) {
        const report = feature.get("reportData");

        tooltip.innerHTML = `
          <strong>Status:</strong> ${report.status}<br/>
          <strong>Time:</strong> ${new Date(
            report.timestamp
          ).toLocaleString()}
        `;

        overlay.setPosition(evt.coordinate);
        tooltip.style.display = "block";
      } else {
        tooltip.style.display = "none";
      }
    });

    setMapObj(map);

    return () => {
      map.setTarget(null);
    };
  }, [reports]);

  useEffect(() => {
    if (!mapObj) return;

    mapObj.on("click", (event) => {
      const [lon, lat] = toLonLat(event.coordinate);

      clickMarkerSource.current.clear();

      const feature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: selectedLocationMarker,
            scale: 0.07,
          }),
        })
      );

      clickMarkerSource.current.addFeature(feature);

      if (onMapClick) onMapClick(lon, lat);
    });
  }, [mapObj, onMapClick]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      const results = await response.json();

      if (results.length > 0) {
        const { lon, lat } = results[0];
        const coords = fromLonLat([parseFloat(lon), parseFloat(lat)]);

        mapObj.getView().animate({
          center: coords,
          zoom: 14,
          duration: 800,
        });

        clickMarkerSource.current.clear();

        const feature = new Feature({
          geometry: new Point(coords),
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: selectedLocationMarker,
              scale: 0.07,
            }),
          })
        );

        clickMarkerSource.current.addFeature(feature);
      } else {
        message.error("Location not found!");
      }
    } catch (error) {
      message.error("Search failed!");
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ margin: "15px auto" }}>
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "250px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#2d6a4f",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Map */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
};

export default MapView;
