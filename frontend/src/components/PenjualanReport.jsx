import React, { useState, useEffect } from "react";
import { api } from "../services/api"; // Adjust this import if needed

export default function PenjualanReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get("/penjualan"); // Adjust API endpoint to match your backend
        setSales(response.data.data); // Assumes data comes in the format { data: [...] }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Laporan Penjualan</h2>

      {loading ? (
        <div className="text-center">Memuat data...</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>No. Transaksi</th>
              <th>Marketing ID</th>
              <th>Tanggal</th>
              <th>Biaya Kargo</th>
              <th>Saldo Total</th>
              <th>Total Grand</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={sale.id}>
                <td>{index + 1}</td>
                <td>{sale.transaction_number}</td>
                <td>{sale.marketing_id}</td>
                <td>{new Date(sale.date).toLocaleDateString("id-ID")}</td>
                <td>
                  Rp
                  {Number(sale.cargo_fee)
                    .toFixed(3)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    .replace(".", ",")}
                </td>
                <td>
                  Rp
                  {Number(sale.total_balance)
                    .toFixed(3)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    .replace(".", ",")}
                </td>
                <td>
                  Rp
                  {Number(sale.grand_total)
                    .toFixed(3)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    .replace(".", ",")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
