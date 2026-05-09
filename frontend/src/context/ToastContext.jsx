import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast show mb-2"
            role="alert"
            style={{
              background: toast.type === 'error' ? '#7C2D12' : '#1C1917',
              color: '#FAF8F5',
              border: 'none',
              borderRadius: '2px',
              minWidth: '280px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <div className="toast-body d-flex justify-content-between align-items-center">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                {toast.message}
              </span>
              <button
                type="button"
                className="btn-close btn-close-white ms-3"
                style={{ fontSize: '0.6rem', opacity: 0.6 }}
                onClick={() => removeToast(toast.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
};
