import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";  // 👈 İŞTE EKSİK OLAN KRİTİK SATIR BU!
import "./admin/utils/auth";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
