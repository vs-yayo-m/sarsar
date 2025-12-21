// ============================================================
// FILE PATH: src/components/shared/Pagination.jsx
// ============================================================
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 5 page numbers
  const visiblePages = pages.filter((page) => {
    return (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    );
  });
  
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {visiblePages.map((page, index) => {
        const showEllipsis = index > 0 && page - visiblePages[index - 1] > 1;
        
        return (
          <>
            {showEllipsis && <span className="px-2">...</span>}
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium ${
                page === currentPage
                  ? 'bg-orange-600 text-white'
                  : 'border hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          </>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;