// src/pages/RUPTablePaginated.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@heroui/react';

// Proxy endpoint
const RUP_API_URL = '/rup-api/isb-2/api/ce33a5db-a6fc-4490-899e-35e84c231452/json/16357/RUP-PaketPenyedia-Terumumkan/tipe/4:12/parameter/2025:D112';

const PAGE_SIZE = 100; // rows per page

export default function RUPTablePaginated() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(RUP_API_URL)
      .then(res => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setError('Format data tidak terduga');
        }
      })
      .catch(err => setError('Gagal memuat data.'))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentRows = data.slice(startIndex, startIndex + PAGE_SIZE);

  const goPrev = () => setPage(p => Math.max(p - 1, 1));
  const goNext = () => setPage(p => Math.min(p + 1, totalPages));

  if (loading) return <p className="p-6 text-gray-600">Loading data...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daftar RUP Penyedia 2025</h1>
      <div className="flex items-center mb-2">
        <Button onClick={goPrev} disabled={page === 1}>Prev</Button>
        <span className="px-4">Page {page} of {totalPages}</span>
        <Button onClick={goNext} disabled={page === totalPages}>Next</Button>
      </div>
      <div className="overflow-auto rounded border">
        <Table>
          <TableHeader>
            <TableColumn>No</TableColumn>
            <TableColumn>Satker</TableColumn>
            <TableColumn>Paket</TableColumn>
            <TableColumn>Pagu</TableColumn>
            <TableColumn>Metode</TableColumn>
            <TableColumn>Jenis</TableColumn>
          </TableHeader>
          <TableBody>
            {currentRows.map((item, idx) => (
              <TableRow key={item.kd_rup || idx}>
                <TableCell>{startIndex + idx + 1}</TableCell>
                <TableCell>{item.nama_satker}</TableCell>
                <TableCell>{item.nama_paket}</TableCell>
                <TableCell>{item.pagu?.toLocaleString('id-ID') ?? '-'}</TableCell>
                <TableCell>{item.metode_pengadaan}</TableCell>
                <TableCell>{item.jenis_pengadaan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
