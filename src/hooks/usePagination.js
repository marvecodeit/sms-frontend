import { useState, useMemo } from 'react';

export const usePagination = (data = [], pageSize = 10) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paginated = useMemo(() => data.slice((page - 1) * pageSize, page * pageSize), [data, page, pageSize]);
  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  return { page, totalPages, paginated, goTo, setPage };
};

export const useSearch = (data = [], keys = []) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(item => keys.some(key => String(item[key] || '').toLowerCase().includes(q)));
  }, [data, query, keys]);
  return { query, setQuery, filtered };
};

export const Pagination = ({ page, totalPages, goTo }) => {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '1rem' }}>
      <button onClick={() => goTo(page - 1)} disabled={page === 1}
        style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => goTo(p)}
          style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            background: p === page ? 'var(--primary)' : 'var(--surface2)',
            color: p === page ? '#fff' : 'var(--text-muted)',
            borderColor: p === page ? 'var(--primary)' : 'var(--border)',
          }}>
          {p}
        </button>
      ))}
      <button onClick={() => goTo(page + 1)} disabled={page === totalPages}
        style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        →
      </button>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
        Page {page} of {totalPages}
      </span>
    </div>
  );
};
