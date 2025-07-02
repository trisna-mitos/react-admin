import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react';

// Proxy path to avoid CORS in development
const API_PATH = '/rup-api/isb-2/api/ce33a5db-a6fc-4490-899e-35e84c231452/json/16357/RUP-PaketPenyedia-Terumumkan/tipe/4:12/parameter/2025:D112';

export default function GetDataPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching RUP data from:', API_PATH);
    axios
      .get(API_PATH)
      .then((res) => {
        console.log('Response headers:', res.headers);
        console.log('Raw data length:', Array.isArray(res.data) ? res.data.length : 'non-array');
        if (!Array.isArray(res.data)) {
          throw new Error('Expected JSON array but got ' + typeof res.data);
        }
        setRows(res.data);
      })
      .catch((err) => {
        const msg = err.response
          ? `HTTP ${err.response.status}`
          : err.message;
        console.error('Fetch error:', msg, err);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading data...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Data RUP Penyedia 2025</h2>
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
            {rows.map((item, i) => (
              <TableRow key={item.kd_rup || i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.nama_satker}</TableCell>
                <TableCell>{item.nama_paket}</TableCell>
                <TableCell>{item.pagu?.toLocaleString('id-ID')}</TableCell>
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
