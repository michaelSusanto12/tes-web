import React, { useState } from "react";
import { api } from "../services/api";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    penjualan_id: "",
    amount: "",
    payment_date: "",
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove commas from the amount and convert it to a number
    const numericAmount = parseFloat(formData.amount.replace(/,/g, ""));

    // Send the updated formData to the API
    try {
      const response = await api.post("/payments", {
        ...formData,
        amount: numericAmount, // Send as numeric value
      });

      setMessage({
        type: "success",
        text: `Pembayaran berhasil! Sisa saldo: Rp${response.data.data.remaining_balance.toLocaleString()}`,
      });
      setFormData({ penjualan_id: "", amount: "", payment_date: "" });
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Gagal melakukan pembayaran",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-success">Form Pembayaran Kredit</h2>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">ID Penjualan</label>
            <input
              type="number"
              className="form-control"
              value={formData.penjualan_id}
              onChange={(e) =>
                setFormData({ ...formData, penjualan_id: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Jumlah Pembayaran</label>
            <input
              type="text"
              className="form-control"
              value={formData.amount}
              onChange={(e) => {
                // Format the amount with commas
                const formattedValue = e.target.value
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setFormData({ ...formData, amount: formattedValue });
              }}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Tanggal Pembayaran</label>
            <input
              type="date"
              className="form-control"
              value={formData.payment_date}
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Simpan Pembayaran
        </button>
      </form>
    </div>
  );
}
