import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CommissionReport from "./components/CommisionReport.jsx";
import PaymentForm from "./components/PaymentForm";
import PaymentHistory from "./components/PaymentHistory";
import PenjualanForm from "./components/PenjualanForm";
import PenjualanReport from "./components/PenjualanReport"; // Import the new component

export default function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Sistem Komisi
          </Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Komisi
            </Link>
            <Link className="nav-link" to="/tambah-pembayaran">
              Tambah Pembayaran
            </Link>
            <Link className="nav-link" to="/riwayat-pembayaran">
              Riwayat Pembayaran
            </Link>
            <Link className="nav-link" to="/tambah-penjualan">
              Tambah Penjualan
            </Link>
            <Link className="nav-link" to="/laporan-penjualan"> {/* Link for Penjualan Report */}
              Laporan Penjualan
            </Link>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<CommissionReport />} />
          <Route path="/tambah-pembayaran" element={<PaymentForm />} />
          <Route path="/riwayat-pembayaran" element={<PaymentHistory />} />
          <Route path="/tambah-penjualan" element={<PenjualanForm />} />
          <Route path="/laporan-penjualan" element={<PenjualanReport />} /> {/* Route for Penjualan Report */}
        </Routes>
      </div>
    </>
  );
}
