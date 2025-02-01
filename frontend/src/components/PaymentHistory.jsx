import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PaymentHistory() {
  const [saleId, setSaleId] = useState("");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "belum", "sudah"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const handleSearch = async () => {
    if (!saleId) return;

    setLoading(true);
    try {
      const response = await api.get(`/payments/${saleId}`);
      setHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/payments/${id}`, {
        status: newStatus, // pastikan status benar-benar dikirim
      });

      if (response.data.success) {
        alert("Status berhasil diperbarui");
        handleSearch(); // Refresh data tanpa reload halaman
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        `Gagal memperbarui status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Update remaining balance jika ada pembayaran yang sudah diverifikasi
  const updateRemainingBalance = () => {
    if (!history) return;

    const verifiedPayments = history.payments.filter(
      (payment) => payment.status === "Sudah Diverifikasi"
    );

    const totalVerifiedAmount = verifiedPayments.reduce(
      (total, payment) => total + parseFloat(payment.amount),
      0
    );

    const newRemainingBalance =
      parseFloat(history.grand_total) - totalVerifiedAmount;

    // Only update if remaining balance has changed
    if (history.remaining_balance !== newRemainingBalance.toFixed(3)) {
      setHistory((prevHistory) => ({
        ...prevHistory,
        remaining_balance: newRemainingBalance.toFixed(3),
      }));
    }
  };

  const handleDownloadPDF = () => {
    if (!history) return;

    const doc = new jsPDF();
    doc.text("Riwayat Pembayaran", 14, 10);

    // Add Total Transaction and Remaining Balance
    doc.text(
      `Total Transaksi: Rp ${parseFloat(history.grand_total).toLocaleString(
        "id-ID",
        {
          minimumFractionDigits: 3,
        }
      )}`,
      14,
      18
    );
    doc.text(
      `Sisa Saldo: Rp ${parseFloat(
        history.remaining_balance ?? 0
      ).toLocaleString("id-ID", {
        minimumFractionDigits: 3,
      })}`,
      14,
      24
    );

    // Prepare payment table data
    const tableData = history.payments.map((payment, index) => [
      index + 1,
      payment.payment_date
        ? new Date(payment.payment_date).toLocaleDateString("id-ID")
        : "-",
      `Rp ${parseFloat(payment.amount).toLocaleString("id-ID", {
        minimumFractionDigits: 3,
      })}`,
      payment.status,
    ]);

    // Add payment history table
    doc.autoTable({
      head: [["#", "Tanggal", "Jumlah", "Status"]],
      body: tableData,
      startY: 30, // Start the table below the total transaction and balance information
    });

    // Save the PDF
    doc.save(`riwayat_pembayaran_${saleId}.pdf`);
  };

  // Memanggil fungsi untuk update saldo setelah data pembayaran terupdate
  useEffect(() => {
    if (history) {
      updateRemainingBalance();
    }
  }, [history]);

  // Pagination logic
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = history?.payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil((history?.payments.length || 0) / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-info">Riwayat Pembayaran</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="Masukkan ID Penjualan"
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Mencari..." : "Cari"}
          </button>
        </div>
      </div>

      {history && (
        <>
          <h5>
            Total Transaksi: Rp{" "}
            {parseFloat(history.grand_total).toLocaleString("id-ID", {
              minimumFractionDigits: 3,
            })}
          </h5>

          <div className="alert alert-warning">
            Sisa Saldo: Rp{" "}
            {parseFloat(history.remaining_balance ?? 0).toLocaleString(
              "id-ID",
              { minimumFractionDigits: 3 }
            )}
          </div>

          {/* Filter Buttons */}
          <div className="btn-group mb-3">
            <button
              className={`btn ${
                filterStatus === "belum" ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setFilterStatus("belum")}
            >
              Belum
            </button>
            <button
              className={`btn ${
                filterStatus === "sudah" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilterStatus("sudah")}
            >
              Sudah
            </button>
            <button className="btn btn-warning" onClick={handleDownloadPDF}>
              Cetak PDF
            </button>
          </div>

          {/* Filtered Table */}
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments
                .filter((payment) => {
                  if (filterStatus === "belum")
                    return payment.status !== "Sudah Diverifikasi";
                  if (filterStatus === "sudah")
                    return payment.status === "Sudah Diverifikasi";
                  return true;
                })
                .map((payment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>
                    <td>
                      Rp{" "}
                      {parseFloat(payment.amount).toLocaleString("id-ID", {
                        minimumFractionDigits: 3,
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          payment.status === "Sudah Diverifikasi"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.status === "Belum Diverifikasi" ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => updateStatus(payment.id, "LUNAS")}
                        >
                          Sudah Diverifikasi
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => updateStatus(payment.id, "PARTIAL")}
                        >
                          Belum Diverifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
