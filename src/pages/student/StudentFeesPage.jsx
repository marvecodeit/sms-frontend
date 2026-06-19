import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  CreditCard, CheckCircle, AlertCircle, Clock, Loader2,
  ChevronDown, ChevronUp, X, ExternalLink, RefreshCw,
} from 'lucide-react';
import feeAPI from '../../api/fee.api';
import { useAuth } from '../../context/AuthContext';
import ReceiptModal from '../../components/ReceiptModal';

const PAYSTACK_KEY    = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const MONNIFY_API_KEY = import.meta.env.VITE_MONNIFY_API_KEY;
const MONNIFY_CONTRACT = import.meta.env.VITE_MONNIFY_CONTRACT_CODE;
const MONNIFY_IS_TEST  = import.meta.env.VITE_MONNIFY_IS_TEST !== 'false';

const STATUS_CONFIG = {
  paid:     { label: 'Paid',     Icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  partial:  { label: 'Partial',  Icon: AlertCircle, cls: 'bg-yellow-50  text-yellow-700  border-yellow-200' },
  not_paid: { label: 'Not Paid', Icon: Clock,       cls: 'bg-red-50     text-red-700     border-red-200' },
};

const GATEWAYS = [
  {
    id:    'paystack',
    name:  'Paystack',
    desc:  'Card · Bank Transfer · USSD',
    color: 'border-blue-200   hover:border-blue-500   bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id:    'monnify',
    name:  'Monnify',
    desc:  'Card · Bank Transfer · USSD',
    color: 'border-purple-200 hover:border-purple-500 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    id:    'opay',
    name:  'OPay',
    desc:  'Card · Wallet · Bank Transfer',
    color: 'border-green-200  hover:border-green-500  bg-green-50',
    badge: 'bg-green-100 text-green-700',
  },
];

// ── Gateway picker overlay ───────────────────────────────────────────────────
function GatewayModal({ isOpen, amount, onSelect, onClose }) {
  if (!isOpen) return null;
  const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Choose Payment Gateway</h2>
            <p className="text-xs text-gray-400 mt-0.5">Paying {fmt(amount)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2.5">
          {GATEWAYS.map((gw) => (
            <button
              key={gw.id}
              onClick={() => onSelect(gw.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition text-left ${gw.color}`}
            >
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0 ${gw.badge}`}>
                {gw.name}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{gw.name}</p>
                <p className="text-xs text-gray-500">{gw.desc}</p>
              </div>
            </button>
          ))}
          <p className="text-center text-[11px] text-gray-400 pt-1">
            All payments are secured and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Single fee card ──────────────────────────────────────────────────────────
function FeeCard({ item, userEmail, onPaid }) {
  const { fee, payment } = item;
  const [expanded,     setExpanded]     = useState(false);
  const [method,       setMethod]       = useState('full');
  const [customAmt,    setCustomAmt]    = useState('');
  const [paying,       setPaying]       = useState(false);
  const [gwModal,      setGwModal]      = useState(false);
  // OPay: after opening the cashier tab, show a "verify" bar
  const [opaySession,  setOpaySession]  = useState(null); // { reference, feeId, method }
  const [verifying,    setVerifying]    = useState(false);
  // Receipt
  const [receipt,      setReceipt]      = useState(null); // payment object

  const { totalAmount, amountPaid, balance, status } = payment;
  const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

  const getPayAmount = () => {
    if (method === 'full')        return balance;
    if (method === 'installment') return Math.ceil(totalAmount / 3);
    return Number(customAmt) || 0;
  };

  // ── Called after GatewayModal selection ─────────────────────────────────
  const handleGatewaySelect = async (gateway) => {
    setGwModal(false);
    const amount = getPayAmount();
    if (amount <= 0)      return toast.error('Enter a valid amount');
    if (amount > balance) return toast.error(`Amount exceeds balance of ${fmt(balance)}`);

    setPaying(true);
    try {
      if (gateway === 'paystack') await runPaystack(amount);
      if (gateway === 'monnify')  await runMonnify(amount);
      if (gateway === 'opay')     await runOPay(amount);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment failed');
      setPaying(false);
    }
  };

  // ── Paystack ─────────────────────────────────────────────────────────────
  const runPaystack = async (amount) => {
    if (!PAYSTACK_KEY || PAYSTACK_KEY.includes('your_paystack'))
      throw new Error('Add VITE_PAYSTACK_PUBLIC_KEY to frontend/.env');
    if (!window.PaystackPop)
      throw new Error('Paystack script not loaded — check connection');

    const { data } = await feeAPI.initializePayment({ feeId: fee._id, amount, method, gateway: 'paystack' });

    return new Promise((resolve) => {
      window.PaystackPop.setup({
        key:   PAYSTACK_KEY,
        email: userEmail,
        amount: Math.round(amount * 100),
        ref:    data.reference,
        callback: async (response) => {
          try {
            const { data: v } = await feeAPI.verifyPayment(response.reference, 'paystack');
            toast.success(v.message || 'Payment recorded!');
            setReceipt(v.payment);
            onPaid();
          } catch (e) {
            toast.error(e.response?.data?.message || 'Verify failed');
          } finally { setPaying(false); resolve(); }
        },
        onClose: () => { toast('Payment window closed'); setPaying(false); resolve(); },
      }).openIframe();
    });
  };

  // ── Monnify ───────────────────────────────────────────────────────────────
  const runMonnify = async (amount) => {
    if (!MONNIFY_API_KEY || MONNIFY_API_KEY.includes('your_monnify'))
      throw new Error('Add VITE_MONNIFY_API_KEY to frontend/.env');
    if (!MONNIFY_CONTRACT || MONNIFY_CONTRACT.includes('your_monnify'))
      throw new Error('Add VITE_MONNIFY_CONTRACT_CODE to frontend/.env');
    if (!window.MonnifySDK)
      throw new Error('Monnify SDK not loaded — reload and try again');

    const { data: initData } = await feeAPI.initializePayment({ feeId: fee._id, amount, method, gateway: 'monnify' });

    return new Promise((resolve) => {
      window.MonnifySDK.initialize({
        amount:             initData.amount,
        currency:           'NGN',
        reference:          initData.reference,
        customerFullName:   initData.fullname || 'Student',
        customerEmail:      initData.email    || userEmail,
        apiKey:             MONNIFY_API_KEY,
        contractCode:       MONNIFY_CONTRACT,
        paymentDescription: initData.feeTitle || fee.title,
        isTestMode:         MONNIFY_IS_TEST,
        onLoadStart:    function() {},
        onLoadComplete: function() {},
        onComplete: function(response) {
          const ok = response.status === 'SUCCESS' || response.paymentStatus === 'PAID';
          if (ok) {
            feeAPI.verifyPayment(initData.reference, 'monnify', fee._id, method)
              .then(function(res) {
                toast.success(res.data.message || 'Payment recorded!');
                setReceipt(res.data.payment);
                onPaid();
              })
              .catch(function(e) {
                toast.error(e.response?.data?.message || 'Verify failed');
              })
              .finally(function() { setPaying(false); resolve(); });
          } else {
            toast.error('Monnify: payment ' + (response.status || 'not completed'));
            setPaying(false); resolve();
          }
        },
        onClose: function() { toast.info('Monnify closed'); setPaying(false); resolve(); },
      });
    });
  };

  // ── OPay (redirect to new tab) ────────────────────────────────────────────
  const runOPay = async (amount) => {
    const { data } = await feeAPI.initializePayment({ feeId: fee._id, amount, method, gateway: 'opay' });
    window.open(data.cashierUrl, '_blank', 'noopener,noreferrer');
    setOpaySession({ reference: data.reference, feeId: fee._id, method });
    setPaying(false); // release "processing" — student pays in new tab
    toast.info('Complete your payment in the new tab, then click "I\'ve Paid" below');
  };

  // ── OPay manual verify after returning ───────────────────────────────────
  const verifyOPay = async () => {
    if (!opaySession) return;
    setVerifying(true);
    try {
      const { data } = await feeAPI.verifyPayment(
        opaySession.reference, 'opay', opaySession.feeId, opaySession.method,
      );
      toast.success(data.message || 'Payment recorded!');
      setReceipt(data.payment);
      setOpaySession(null);
      onPaid();
    } catch (err) {
      toast.error(err.response?.data?.message || 'OPay payment not yet confirmed — wait and try again');
    } finally {
      setVerifying(false);
    }
  };

  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.not_paid;
  const StatusIcon = sc.Icon;
  const isPaid = status === 'paid';

  return (
    <>
      <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${sc.cls}`}>
        {/* Header */}
        <div className="p-4 flex items-start gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 truncate">{fee.title}</h3>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.cls}`}>
                <StatusIcon size={11} /> {sc.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {fee.class?.name} · {fee.term}{fee.session ? ` · ${fee.session}` : ''}
            </p>
          </div>
          {!isPaid && (
            <button onClick={() => setExpanded((p) => !p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-px bg-gray-100">
          {[
            { label: 'Total Fee', value: fmt(totalAmount) },
            { label: 'Paid',      value: fmt(amountPaid), green: true },
            { label: 'Balance',   value: fmt(balance),    red: balance > 0 },
          ].map(({ label, value, green, red }) => (
            <div key={label} className="bg-white p-3 text-center">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className={`text-base font-bold ${green ? 'text-emerald-600' : red ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* OPay pending bar */}
        {opaySession && (
          <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between gap-3">
            <p className="text-xs text-green-700 font-medium">
              Completed your payment on OPay?
            </p>
            <button
              onClick={verifyOPay}
              disabled={verifying}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {verifying ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {verifying ? 'Verifying…' : "I've Paid"}
            </button>
          </div>
        )}

        {/* Payment panel */}
        {!isPaid && expanded && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
            {/* Payment method */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">How would you like to pay?</p>
              <div className="space-y-2">
                {[
                  { value: 'full',        label: `Full Payment — ${fmt(balance)}`,                    show: fee.paymentOptions?.fullPayment !== false },
                  { value: 'installment', label: `Installment (1/3) — ${fmt(Math.ceil(totalAmount / 3))}`, show: fee.paymentOptions?.installment },
                  { value: 'custom',      label: 'Custom Amount',                                     show: fee.paymentOptions?.customAmount },
                ].filter((o) => o.show).map((o) => (
                  <label key={o.value} className="flex items-center gap-2.5 cursor-pointer text-sm">
                    <input type="radio" name={`method-${fee._id}`} value={o.value}
                      checked={method === o.value} onChange={() => setMethod(o.value)}
                      className="accent-blue-600" />
                    <span className="text-gray-700">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {method === 'custom' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter Amount (₦)</label>
                <input type="number" min="1" max={balance}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Max: ${fmt(balance)}`}
                  value={customAmt} onChange={(e) => setCustomAmt(e.target.value)} />
              </div>
            )}

            <button
              onClick={() => setGwModal(true)}
              disabled={paying}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {paying ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              {paying ? 'Processing…' : `Pay ${fmt(getPayAmount())}`}
            </button>

            {/* Transaction history */}
            {payment.transactions?.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">Transaction History</p>
                {payment.transactions.map((t, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-500 py-1">
                    <span>
                      {new Date(t.paidAt).toLocaleDateString()} · {t.method}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold
                        ${t.gateway === 'monnify' ? 'bg-purple-100 text-purple-700'
                        : t.gateway === 'opay'    ? 'bg-green-100  text-green-700'
                        :                           'bg-blue-100   text-blue-700'}`}>
                        {t.gateway || 'paystack'}
                      </span>
                    </span>
                    <span className="font-semibold text-emerald-600">{fmt(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isPaid && (
          <div className="px-4 pb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <CheckCircle size={16} /> Fee fully settled
            </span>
            {payment.transactions?.length > 0 && (
              <button
                onClick={() => setReceipt(payment)}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                View Receipt
              </button>
            )}
          </div>
        )}
      </div>

      {/* Gateway picker */}
      <GatewayModal
        isOpen={gwModal}
        amount={getPayAmount()}
        onSelect={handleGatewaySelect}
        onClose={() => setGwModal(false)}
      />

      {/* Auto receipt after payment */}
      <ReceiptModal
        isOpen={!!receipt}
        payment={receipt}
        onClose={() => setReceipt(null)}
      />
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function StudentFeesPage() {
  const { user } = useAuth();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFees = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await feeAPI.getMyFees();
      setData(res.fees || []);
    } catch {
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFees(); }, [loadFees]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Fees</h1>
        <p className="text-gray-500 text-sm mt-1">View your fee balance and make payments</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-blue-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <CreditCard size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No fees assigned yet</p>
          <p className="text-gray-400 text-sm">Check back later</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, i) => (
            <FeeCard
              key={item.fee._id || i}
              item={item}
              userEmail={user?.email || ''}
              onPaid={loadFees}
            />
          ))}
        </div>
      )}
    </div>
  );
}
