import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function PenjualanForm() {
  const [formData, setFormData] = useState({
    transaction_number: "",
    marketing_id: "",
    date: new Date().toISOString().split("T")[0],
    cargo_fee: "",
    total_balance: "",
    grand_total: "0",
  });

  const [marketingList, setMarketingList] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMarketing = async () => {
      try {
        const response = await api.get("/marketings");
        setMarketingList(response.data.data);
      } catch (error) {
        console.error("Error fetching marketing:", error);
      }
    };
    fetchMarketing();
  }, []);

  useEffect(() => {
    const cargo = parseFloat(formData.cargo_fee.replace(/,/g, "")) || 0;
    const balance = parseFloat(formData.total_balance.replace(/,/g, "")) || 0;
    setFormData((prev) => ({
      ...prev,
      grand_total: (cargo + balance).toLocaleString(),
    }));
  }, [formData.cargo_fee, formData.total_balance]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        marketing_id: parseInt(formData.marketing_id),
        cargo_fee: parseFloat(formData.cargo_fee.replace(/,/g, "")),
        total_balance: parseFloat(formData.total_balance.replace(/,/g, "")),
        grand_total: parseFloat(formData.grand_total.replace(/,/g, "")),
      };

      await api.post("/penjualan", payload);

      setMessage({
        type: "success",
        text: "Data penjualan berhasil ditambahkan!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Gagal menambahkan data",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-file-earmark-plus me-2"></i>
        Form Tambah Penjualan
      </h2>

      {message && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nomor Transaksi</label>
            <input
              type="text"
              className="form-control"
              value={formData.transaction_number}
              onChange={(e) =>
                setFormData({ ...formData, transaction_number: e.target.value })
              }
              placeholder="TRXXXX"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Marketing</label>
            <select
              className="form-select"
              value={formData.marketing_id}
              onChange={(e) =>
                setFormData({ ...formData, marketing_id: e.target.value })
              }
              required
            >
              <option value="">Pilih Marketing</option>
              {marketingList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (ID: {m.id})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Tanggal Transaksi</label>
            <input
              type="date"
              className="form-control"
              value={formData.date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Biaya Kirim</label>
            <div className="input-group">
              <span className="input-group-text">Rp</span>
              <input
                type="text"
                className="form-control"
                value={formData.cargo_fee}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setFormData({ ...formData, cargo_fee: val });
                }}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Total Balance</label>
            <div className="input-group">
              <span className="input-group-text">Rp</span>
              <input
                type="text"
                className="form-control"
                value={formData.total_balance}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setFormData({ ...formData, total_balance: val });
                }}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Grand Total</label>
            <div className="input-group">
              <span className="input-group-text">Rp</span>
              <input
                type="text"
                className="form-control bg-light"
                value={formData.grand_total}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save me-2"></i>
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}
