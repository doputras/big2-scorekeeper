import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({ confirmDialog, onCancel }) => {
    if (!confirmDialog.isOpen) return null;

    return (
        <Modal
            title="Confirm"
            onClose={onCancel}
            footer={
                <>
                    {/* showModal() focuses the first control, so Cancel is what a
                        stray Enter hits -- deliberate for a destructive confirm. */}
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button
                        className={`btn ${confirmDialog.style === 'gold' ? 'btn-primary' : ''}`}
                        onClick={confirmDialog.action}
                    >
                        {confirmDialog.confirmText}
                    </button>
                </>
            }
        >
            <div className="modal-message">{confirmDialog.message}</div>
        </Modal>
    );
};
