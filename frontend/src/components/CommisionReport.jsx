import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function CommissionReport() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await api.get("/commissions");
        setCommissions(response.data.data);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Laporan Komisi Marketing</h2>

      {loading ? (
        <div className="text-center">Memuat data...</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Marketing</th>
              <th>Bulan</th>
              <th>Omzet</th>
              <th>Komisi (%)</th>
              <th>Nominal Komisi</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission, index) => (
              <tr key={index}>
                <td>{commission.marketing}</td>
                <td>
                  {new Date(`${commission.bulan}-01`).toLocaleDateString(
                    "id-ID",
                    {
                      month: "long",
                    }
                  )}
                </td>

                <td>
                  Rp
                  {Number(commission.omzet)
                    .toFixed(3)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    .replace(".", ",")}{" "}
                </td>

                <td>{commission.komisi_persen}%</td>
                <td className="fw-bold">
                  Rp
                  {commission.komisi_nominal.toLocaleString("id-ID", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
