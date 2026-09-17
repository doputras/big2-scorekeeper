import { useEffect, useId, useRef } from 'react';

// ponytail: <dialog>.showModal() is the platform's own modal -- focus trap,
// Escape, inert background and dialog semantics all come free. The listener is
// native rather than React's onCancel so the close path cannot silently drift.
export const Modal = ({ title, onClose, children, footer }) => {
    const ref = useRef(null);
    const onCloseRef = useRef(onClose);
    const titleId = useId();

    onCloseRef.current = onClose;

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog.open) dialog.showModal();

        const handleCancel = (e) => {
            e.preventDefault();
            onCloseRef.current();
        };

        dialog.addEventListener('cancel', handleCancel);
        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            dialog.close();
        };
    }, []);

    return (
        <dialog
            className="modal"
            ref={ref}
            aria-labelledby={titleId}
            onClick={e => { if (e.target === ref.current) onCloseRef.current(); }}
        >
            <div className="modal-header">
                <div className="panel-title" id={titleId}>{title}</div>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{footer}</div>
        </dialog>
    );
};
