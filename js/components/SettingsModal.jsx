import { clampSetValue } from '../utils/session.js';
import { Modal } from './Modal.jsx';

export const SettingsModal = ({ settingsModal, setSettingsModal, onApply }) => {
    if (!settingsModal.isOpen) return null;

    const close = () => setSettingsModal({ isOpen: false, tempMode: false, tempValue: 0 });

    return (
        <Modal
            title="Edit game settings"
            onClose={close}
            footer={
                <>
                    <button className="btn" onClick={close}>Cancel</button>
                    <button className="btn btn-primary" onClick={onApply}>Apply settings</button>
                </>
            }
        >
            <div className="modal-warning">
                This changes the rules used to calculate the entire current game. The score values in each round stay the same.
            </div>
            <div className="modal-fields">
                <div>
                    <div className="field-label">Scoring mode</div>
                    <div className="segmented">
                        <button
                            className={!settingsModal.tempMode ? 'active' : ''}
                            onClick={() => setSettingsModal(s => ({ ...s, tempMode: false }))}
                        >
                            Classic
                        </button>
                        <button
                            className={settingsModal.tempMode ? 'active' : ''}
                            onClick={() => setSettingsModal(s => ({ ...s, tempMode: true }))}
                        >
                            Top 2 / Bottom 2
                        </button>
                    </div>
                </div>
                <div>
                    <div className="field-label">Value per point</div>
                    <input
                        className="number-input"
                        type="number"
                        min="0"
                        inputMode="numeric"
                        // An empty field stays empty: a controlled 0 here is what
                        // turned typing "300" into "0300".
                        value={settingsModal.tempValue || ''}
                        placeholder="0"
                        onChange={e => setSettingsModal(s => ({ ...s, tempValue: clampSetValue(e.target.value) }))}
                    />
                </div>
            </div>
        </Modal>
    );
};
