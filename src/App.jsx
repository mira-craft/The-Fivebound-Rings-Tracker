import { Routes, Route, Navigate } from "react-router-dom";
import CampaignApp from "./components/CampaignApp";

export default function App() {
  return (
    <Routes>
      <Route path="/c/:campaignId" element={<CampaignApp />} />
      <Route path="*" element={<Navigate to="/c/hellgate" replace />} />
    </Routes>
  );
}
