import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feeAPI } from '../../api/fee.api';
import adminAPI from '../../api/admin.api';
import {
  CreditCard, FileText, CheckCircle, Search, Printer,
  Upload, DollarSign, ChevronDown,
} from 'lucide-react';

// ─── Receipt Print ─────────────────────────────────────────────────────────────
function printReceipt({ studentName, schoolName, logoUrl, feeName, amount, balance, totalAmount, method, date, receiptNo }) {
  const isPaid    = Number(balance) <= 0;
  const statusBg  = isPaid ? '#16a34a' : '#d97706';
  const statusTxt = isPaid ? '✓ FULLY PAID' : '⚠ PARTIAL PAYMENT';

  const win = window.open('', '_blank', 'width=680,height=900');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Receipt</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Inter,sans-serif;background:#fff;color:#111;padding:40px}
  .header{text-align:center;margin-bottom:28px;border-bottom:2px solid #111;padding-bottom:20px}
  .logo{max-height:80px;max-width:160px;object-fit:contain;margin:0 auto 12px;display:block}
  .school{font-size:22px;font-weight:700;letter-spacing:-.5px}
  .sub{font-size:13px;color:#555;margin-top:4px}
  .badge{display:inline-block;background:${statusBg};color:#fff;font-size:11px;font-weight:600;padding:3px 12px;border-radius:20px;margin-top:8px;letter-spacing:.5px}
  .title{font-size:15px;font-weight:700;text-align:center;margin:20px 0 16px;text-transform:uppercase;letter-spacing:1px;color:#444}
  .amount-row{display:flex;gap:12px;margin-bottom:20px}
  .amount-box{flex:1;border-radius:12px;text-align:center;padding:14px 10px}
  .amount-box.paid{background:#f0fdf4;border:2px solid #16a34a}
  .amount-box.bal{background:${isPaid ? '#f0fdf4' : '#fffbeb'};border:2px solid ${isPaid ? '#16a34a' : '#d97706'}}
  .amount-box .amt{font-size:26px;font-weight:700}
  .amount-box.paid .amt{color:#15803d}
  .amount-box.bal .amt{color:${isPaid ? '#15803d' : '#b45309'}}
  .amount-box .lbl{font-size:11px;color:#666;margin-top:3px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  tr{border-bottom:1px solid #f0f0f0}
  td{padding:9px 4px}
  td:first-child{color:#666;width:45%;font-weight:500}
  td:last-child{font-weight:600;color:#111;text-align:right}
  .footer{text-align:center;margin-top:28px;padding-top:14px;border-top:1px dashed #ccc;font-size:11px;color:#888}
  @media print{body{padding:20px}}
</style>
</head>
<body>
<div class="header">
  ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="logo"/>` : ''}
  <div class="school">${schoolName || 'School Management System'}</div>
  <div class="sub">Fee Payment Receipt</div>
  <span class="badge">${statusTxt}</span>
</div>
<div class="title">Official Receipt</div>
<div class="amount-row">
  <div class="amount-box paid">
    <div class="amt">&#8358;${Number(amount || 0).toLocaleString()}</div>
    <div class="lbl">Amount Paid</div>
  </div>
  <div class="amount-box bal">
    <div class="amt">&#8358;${Number(balance ?? 0).toLocaleString()}</div>
    <div class="lbl">${isPaid ? 'Fully Settled' : 'Balance Remaining'}</div>
  </div>
</div>
<table>
  <tr><td>Student Name</td><td>${studentName || '—'}</td></tr>
  <tr><td>Fee Description</td><td>${feeName || '—'}</td></tr>
  ${totalAmount ? `<tr><td>Total Fee</td><td>&#8358;${Number(totalAmount).toLocaleString()}</td></tr>` : ''}
  <tr><td>Payment Method</td><td>${method || 'Cash'}</td></tr>
  <tr><td>Date</td><td>${date || new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
  <tr><td>Receipt No.</td><td>${receiptNo || `REC-${Date.now()}`}</td></tr>
</table>
<div class="footer">
  This is an official receipt. Keep it for your records.<br/>
  Generated on ${new Date().toLocaleString('en-NG')}
</div>
<script>window.onload=()=>{window.print();setTimeout(()=>window.close(),800)}<\/script>
</body></html>`);
  win.document.close();
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'payment', label: 'Record Cash Payment', Icon: CreditCard },
  { id: 'paid',    label: 'Paid Students',        Icon: CheckCircle },
  { id: 'receipt', label: 'Generate Receipt',     Icon: FileText },
];

export default function SecretaryFeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'payment');

  const switchTab = (t) => { setTab(t); setSearchParams({ tab: t }); };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard size={22} className="text-amber-600" /> Fee Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Record cash payments, view paid students and generate receipts</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => switchTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'payment' && <CashPaymentTab />}
      {tab === 'paid'    && <PaidStudentsTab />}
      {tab === 'receipt' && <ReceiptTab />}
    </div>
  );
}

// ─── Cash Payment Tab ─────────────────────────────────────────────────────────
function CashPaymentTab() {
  const [students, setStudents] = useState([]);
  const [fees, setFees]         = useState([]);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState({ studentId: '', feeId: '', amount: '', method: 'cash' });
  const [saving, setSaving]     = useState(false);
  const [done, setDone]         = useState(null);

  useEffect(() => {
    Promise.all([adminAPI.getAllStudents(), feeAPI.getFees()])
      .then(([sRes, fRes]) => {
        setStudents(sRes.data.students || []);
        setFees(fRes.data.fees || []);
      })
      .catch(() => toast.error('Failed to load data'));
  }, []);

  const filteredStudents = students.filter(s =>
    `${s.fullname} ${s.registrationNumber}`.toLowerCase().includes(search.toLowerCase())
  );
  const selectedFee = fees.find(f => f._id === form.feeId);
  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.feeId || !form.amount) return toast.error('Please fill all required fields');
    setSaving(true);
    try {
      const { data } = await feeAPI.recordCashPayment({
        studentId: form.studentId, feeId: form.feeId,
        amount: Number(form.amount), method: form.method,
      });
      toast.success(data.message);
      setDone(data.payment);
      setForm({ studentId: '', feeId: '', amount: '', method: 'cash' });
      setSearch('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      {done && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">Payment recorded!</p>
            <p className="text-sm text-green-700 mt-0.5">
              {done.student?.fullname} — ₦{done.amountPaid?.toLocaleString()} paid.
              Status: <strong>{done.status}</strong>
              {done.balance > 0 && <> · Balance: ₦{done.balance?.toLocaleString()}</>}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Record Cash Payment</h2>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Search Student</label>
          <div className="relative mb-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => { setSearch(e.target.value); setForm(p => ({ ...p, studentId: '' })); }}
              placeholder="Type student name or reg number…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          {search && !form.studentId && (
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-sm">
              {filteredStudents.length === 0
                ? <p className="text-sm text-gray-400 p-3 text-center">No students found</p>
                : filteredStudents.slice(0, 8).map(s => (
                  <button key={s._id} type="button"
                    onClick={() => { setForm(p => ({ ...p, studentId: s._id })); setSearch(s.fullname); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition text-sm border-b border-gray-50 last:border-0">
                    <span className="font-medium text-gray-900">{s.fullname}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.registrationNumber}</span>
                  </button>
                ))}
            </div>
          )}
          {form.studentId && <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle size={12} /> Student selected</p>}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fee</label>
            <select name="feeId" value={form.feeId} onChange={handle} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
              <option value="">Select fee…</option>
              {fees.map(f => <option key={f._id} value={f._id}>{f.title} — ₦{f.amount?.toLocaleString()} ({f.class?.name || 'All'})</option>)}
            </select>
            {selectedFee && <p className="text-xs text-gray-400 mt-1">Full amount: ₦{selectedFee.amount?.toLocaleString()}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount Paid (₦)</label>
            <input name="amount" type="number" min="1" value={form.amount} onChange={handle} required
              placeholder={selectedFee ? selectedFee.amount : 'Enter amount'}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Method</label>
            <select name="method" value={form.method} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="pos">POS</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <button type="submit" disabled={saving || !form.studentId}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Recording…</>
              : <><DollarSign size={16} /> Record Payment</>}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Paid Students Tab ────────────────────────────────────────────────────────
function PaidStudentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    feeAPI.getPaidStudents()
      .then(({ data }) => setPayments(data.payments || []))
      .catch(() => toast.error('Failed to load paid students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    `${p.student?.fullname} ${p.student?.registrationNumber} ${p.fee?.title}`.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = (p) => {
    const txn = p.transactions?.at(-1);
    printReceipt({
      studentName: p.student?.fullname,
      schoolName:  p.class?.name ? `Class ${p.class.name}` : undefined,
      feeName:     p.fee?.title,
      amount:      txn?.amount || p.amountPaid,
      balance:     p.balance,
      totalAmount: p.totalAmount,
      method:      txn?.method || (txn?.gateway === 'cash' ? 'Cash' : txn?.gateway) || 'Cash',
      date:        txn?.paidAt ? new Date(txn.paidAt).toLocaleDateString('en-NG') : undefined,
      receiptNo:   txn?.reference,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or fee…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16 border border-gray-100" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <CheckCircle size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No paid students found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Student</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Fee</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Paid</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Balance</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{p.student?.fullname}</p>
                      <p className="text-xs text-gray-400">{p.student?.registrationNumber}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{p.fee?.title}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">₦{p.amountPaid?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">
                      <span className={p.balance > 0 ? 'text-amber-600 font-semibold' : 'text-green-600 font-semibold'}>
                        {p.balance > 0 ? `₦${p.balance?.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'paid' ? 'bg-green-100 text-green-700'
                        : p.status === 'partial' ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handlePrint(p)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-amber-100 text-gray-500 hover:text-amber-700 transition" title="Print receipt">
                        <Printer size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Receipt Generator Tab ────────────────────────────────────────────────────
function ReceiptTab() {
  const [payments, setPayments]       = useState([]);
  const [search, setSearch]           = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  const [form, setForm] = useState({
    studentName: '', schoolName: '', feeName: '',
    amount: '', balance: '', totalAmount: '',
    method: 'Cash', date: new Date().toISOString().split('T')[0],
    logoUrl: '', receiptNo: `REC-${Date.now()}`,
  });

  useEffect(() => {
    feeAPI.getPaidStudents()
      .then(({ data }) => setPayments(data.payments || []))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredPayments = payments.filter(p =>
    `${p.student?.fullname} ${p.student?.registrationNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectPayment = (p) => {
    const txn = p.transactions?.at(-1);
    setSelectedPayment(p);
    setSearch(p.student?.fullname || '');
    setShowDropdown(false);
    setForm(prev => ({
      ...prev,
      studentName: p.student?.fullname || '',
      feeName:     p.fee?.title || '',
      amount:      txn?.amount || p.amountPaid || '',
      balance:     p.balance ?? '',
      totalAmount: p.totalAmount || '',
      method:      txn?.method
                    ? txn.method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
                    : txn?.gateway === 'cash' ? 'Cash' : (txn?.gateway || 'Cash'),
      receiptNo:   txn?.reference || `REC-${Date.now()}`,
      date:        txn?.paidAt
                    ? new Date(txn.paidAt).toISOString().split('T')[0]
                    : prev.date,
    }));
  };

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setLogoPreview(ev.target.result); setForm(p => ({ ...p, logoUrl: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const generate = () => {
    if (!form.studentName || !form.amount) return toast.error('Student name and amount are required');
    printReceipt(form);
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-bold text-gray-900">Generate Receipt</h2>
          <p className="text-xs text-gray-400 mt-0.5">Search a paid student to auto-fill, or type manually.</p>
        </div>

        {/* Student search with autocomplete */}
        <div ref={dropRef}>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Student Name *</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); setSelectedPayment(null); setForm(p => ({ ...p, studentName: e.target.value, feeName: '', amount: '', balance: '', totalAmount: '' })); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search paid student…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {showDropdown && search && (
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-md mt-1 z-10 relative bg-white">
              {filteredPayments.length === 0 ? (
                <p className="text-sm text-gray-400 p-3 text-center">No paid students found</p>
              ) : filteredPayments.slice(0, 10).map(p => (
                <button key={p._id} type="button" onClick={() => selectPayment(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition text-sm border-b border-gray-50 last:border-0">
                  <span className="font-medium text-gray-900">{p.student?.fullname}</span>
                  <span className="text-gray-400 text-xs ml-2">{p.fee?.title}</span>
                  <span className={`float-right text-xs font-semibold ${p.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {p.balance > 0 ? `Bal: ₦${p.balance?.toLocaleString()}` : 'Paid'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auto-filled summary */}
        {selectedPayment && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm space-y-1">
            <p className="font-semibold text-amber-800">{selectedPayment.fee?.title}</p>
            <div className="flex gap-4 text-xs text-amber-700">
              <span>Total: ₦{selectedPayment.totalAmount?.toLocaleString()}</span>
              <span>Paid: ₦{selectedPayment.amountPaid?.toLocaleString()}</span>
              <span className="font-semibold">Balance: ₦{selectedPayment.balance?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Logo */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">School Logo (optional)</label>
          <div className="flex items-center gap-3">
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="w-14 h-14 object-contain border border-gray-200 rounded-lg p-1" />
              : <div className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300"><Upload size={20} /></div>
            }
            <div className="flex-1 space-y-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-amber-600 font-medium hover:underline">Upload image</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoFile} className="hidden" />
              <input name="logoUrl" value={form.logoUrl.startsWith('data:') ? '' : form.logoUrl} onChange={handle}
                placeholder="or paste image URL…"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">School Name</label>
            <input name="schoolName" value={form.schoolName} onChange={handle} placeholder="e.g. Marvel Tech Hub School"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fee Description</label>
            <input name="feeName" value={form.feeName} onChange={handle} placeholder="e.g. First Term Fees"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount Paid (₦) *</label>
            <input name="amount" type="number" min="1" value={form.amount} onChange={handle} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Balance Remaining (₦)</label>
            <input name="balance" type="number" min="0" value={form.balance} onChange={handle}
              placeholder="0 if fully paid"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Method</label>
            <select name="method" value={form.method} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>POS</option>
              <option>Cheque</option>
              <option>Online</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
            <input name="date" type="date" value={form.date} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Receipt Number</label>
          <input name="receiptNo" value={form.receiptNo} onChange={handle}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <button onClick={generate}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Printer size={16} /> Generate & Print Receipt
        </button>
      </div>
    </div>
  );
}
