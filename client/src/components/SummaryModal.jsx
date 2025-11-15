import React from 'react';

function SummaryModal({ summary, onClose, aiLoading }) {

  if (!summary && !aiLoading) {
    return null;
  }

  return (
  
    <div className="modal-backdrop" onClick={onClose}>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Project Summary</h2>
        {aiLoading ? (
          <p>Generating your summary...</p>
        ) : (
          <p className="summary-text">{summary}</p>
        )}
        <button onClick={onClose} disabled={aiLoading}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SummaryModal;