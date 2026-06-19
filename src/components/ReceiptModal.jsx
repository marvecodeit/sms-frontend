import { X, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_CFG = {
  paid:     { label: 'FULLY PAID', cls: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle },
  partial:  { label: 'PARTIAL',    cls: 'bg-yellow-100  text-yellow-700',  Icon: AlertCircle },
  not_paid: { label: 'NOT PAID',   cls: 'bg-red-100     text-red-700',     Icon: Clock },
};

const SCHOOL_NAME = import.meta.env.VITE_APP_NAME || 'School Management System';

export default function ReceiptModal({ isOpen, onClose, payment, transaction }) {
  if (!isOpen || !payment) return null;

  const fmt     = (n) => `₦${Number(n || 0).toLocaleString()}`;
  const txn     = transaction || payment.transactions?.[payment.transactions.length - 1] || {};
  const sc      = STATUS_CFG[payment.status] || STATUS_CFG.not_paid;
  const StatusIcon = sc.Icon;

  const paidAt = txn.paidAt
    ? new Date(txn.paidAt).toLocaleString('en-NG', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

  const handlePrint = () => {
    const el  = document.getElementById('sms-receipt');
    const win = window.open('', '_blank', 'width=620,height=750');
    win.document.write(`
      <!doctype html><html><head>
        <title>Receipt — ${payment.student?.fullname || ''}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
          .school { text-align: center; margin-bottom: 16px; }
          .school h2 { font-size: 16px; font-weight: bold; }
          .school p  { font-size: 11px; color: #666; }
          hr { border: none; border-top: 1px dashed #ccc; margin: 12px 0; }
          .center { text-align: center; }
          .amount { font-size: 28px; font-weight: 900; color: #1d4ed8; }
          .badge  { display: inline-block; padding: 4px 12px; border-radius: 20px;
                    font-size: 11px; font-weight: bold; margin-top: 8px; }
          .paid    { background: #d1fae5; color: #065f46; }
          .partial { background: #fef3c7; color: #92400e; }
          .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
          .row .label { color: #666; }
          .row .value { font-weight: 600; text-align: right; max-width: 60%; word-break: break-all; }
          .footer { text-align: center; font-size: 10px; color: #999; margin-top: 16px; }
        </style>
      </head><body>
        ${el.innerHTML}
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }<\/script>
      </body></html>
    `);
    win.document.close();
  };

  const rows = [
    { section: 'Student', items: [
      { label: 'Name',   value: payment.student?.fullname           || '—' },
      { label: 'Reg No', value: payment.student?.registrationNumber || '—' },
      { label: 'Class',  value: payment.class?.name                 || '—' },
    ]},
    { section: 'Fee', items: [
      { label: 'Title',     value: payment.fee?.title   || '—' },
      { label: 'Term',      value: payment.fee?.term    || '—' },
      { label: 'Session',   value: payment.fee?.session || '—' },
      { label: 'Total Fee', value: fmt(payment.totalAmount) },
      ...(payment.balance > 0 ? [{ label: 'Balance', value: fmt(payment.balance) }] : []),
    ]},
    { section: 'Transaction', items: [
      { label: 'Gateway',   value: (txn.gateway || 'paystack').toUpperCase() },
      { label: 'Reference', value: txn.reference || '—' },
      { label: 'Method',    value: txn.method    || '—' },
      { label: 'Date',      value: paidAt },
    ]},
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[92vh] overflow-y-auto">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">Payment Receipt</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
            >
              <Printer size={13} /> Print
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Printable receipt body */}
        <div id="sms-receipt" className="p-5 space-y-4">

          {/* School header */}
          <div className="school text-center">
            <h2 className="text-sm font-black text-gray-900">{SCHOOL_NAME}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Official Payment Receipt</p>
          </div>

          <hr className="border-dashed border-gray-200" />

          {/* Amount + status */}
          <div className="center text-center">
            <p className="text-xs text-gray-400 mb-1">Amount Paid</p>
            <p className="amount text-3xl font-black text-blue-600">{fmt(txn.amount || payment.amountPaid)}</p>
            <span className={`badge inline-flex items-center gap-1 mt-2 text-[11px] font-bold px-3 py-1 rounded-full ${sc.cls}`}>
              <StatusIcon size={11} /> {sc.label}
            </span>
          </div>

          {/* Sections */}
          {rows.map(({ section, items }) => (
            <div key={section}>
              <hr className="border-dashed border-gray-200 mb-3" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{section}</p>
              {items.filter(({ value }) => value && value !== '—' && value !== '₦0').map(({ label, value }) => (
                <div key={label} className="row flex justify-between text-xs py-1">
                  <span className="label text-gray-400">{label}</span>
                  <span className="value font-semibold text-gray-800 text-right max-w-[60%] break-all">{value}</span>
                </div>
              ))}
            </div>
          ))}

          <hr className="border-dashed border-gray-200" />
          <p className="footer text-center text-[10px] text-gray-400">
            Keep this receipt as proof of payment
          </p>
        </div>
      </div>
    </div>
  );
}
