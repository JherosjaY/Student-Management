import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  limit
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Showing <span style={{ fontWeight: 600, color: '#1e293b' }}>{startItem}</span> to <span style={{ fontWeight: 600, color: '#1e293b' }}>{endItem}</span> of <span style={{ fontWeight: 600, color: '#1e293b' }}>{totalItems}</span> results
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            color: currentPage === 1 ? '#cbd5e1' : '#475569',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: currentPage === page ? '#2563eb' : '#e2e8f0',
              backgroundColor: currentPage === page ? '#2563eb' : 'white',
              color: currentPage === page ? 'white' : '#475569',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            color: currentPage === totalPages ? '#cbd5e1' : '#475569',
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
