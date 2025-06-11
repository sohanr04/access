import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import itemApi from '../api/itemApi';
import * as XLSX from 'xlsx';

export default function ItemScanner() {
  const [item, setItem] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
    scanner.render(async (text) => {
      scanner.clear();
      const id = text.split('/').pop();
      const data = await itemApi.getById(id);
      setItem(data);
    });
    scannerRef.current = scanner;
    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const exportCsv = () => {
    if (!item) return;
    const ws = XLSX.utils.json_to_sheet([item]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Item');
    XLSX.writeFile(wb, 'item.csv');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scan Item QR</h1>
      <div id="qr-reader" className="mb-4" />
      {item && (
        <div>
          <table className="table-auto border mb-4">
            <tbody>
              <tr><th className="px-2">Style Code</th><td className="px-2">{item.style_code}</td></tr>
              <tr><th className="px-2">Price</th><td className="px-2">{item.price}</td></tr>
              <tr><th className="px-2">Quantity</th><td className="px-2">{item.quantity}</td></tr>
              <tr><th className="px-2">Color</th><td className="px-2">{item.color}</td></tr>
              <tr><th className="px-2">Fabric Weight</th><td className="px-2">{item.fabric_weight}</td></tr>
              <tr><th className="px-2">Fabric Composition</th><td className="px-2">{item.fabric_composition}</td></tr>
              <tr><th className="px-2">Packaging</th><td className="px-2">{item.packaging_details}</td></tr>
              <tr><th className="px-2">QR Code</th><td className="px-2"><img src={`/${item.qr_code_url}`} alt="qr" width="100" /></td></tr>
            </tbody>
          </table>
          <button onClick={exportCsv} className="bg-blue-500 text-white px-3 py-1">Export CSV</button>
        </div>
      )}
    </div>
  );
}
