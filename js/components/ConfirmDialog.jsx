export const ConfirmDialog = ({ confirmDialog, onCancel }) => {
    if (!confirmDialog.isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <div className="panel-title">Confirm</div>
                </div>
                <div className="modal-body">
                    <div className="modal-message">{confirmDialog.message}</div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button
                        className={`btn ${confirmDialog.style === 'gold' ? 'btn-primary' : ''}`}
                        onClick={confirmDialog.action}
                    >
                        {confirmDialog.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
