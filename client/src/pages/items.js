import { useEffect, useState } from 'react';
import itemApi from '../api/itemApi';

export default function Items() {
  const [items, setItems] = useState([]);
  useEffect(() => { itemApi.getAll().then(setItems); }, []);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Items</h1>
      <table className="table-auto border">
        <thead>
          <tr>
            <th className="px-2">Style Code</th>
            <th className="px-2">Price</th>
            <th className="px-2">Quantity</th>
            <th className="px-2">Color</th>
            <th className="px-2">QR</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td className="px-2">{it.style_code}</td>
              <td className="px-2">{it.price}</td>
              <td className="px-2">{it.quantity}</td>
              <td className="px-2">{it.color}</td>
              <td className="px-2"><img src={`/${it.qr_code_url}`} alt="qr" width="50"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
