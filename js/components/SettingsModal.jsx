export const SettingsModal = ({ settingsModal, setSettingsModal, onApply }) => {
    if (!settingsModal.isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <div className="panel-title">Edit game settings</div>
                </div>
                <div className="modal-body">
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
                                value={settingsModal.tempValue}
                                onChange={e => setSettingsModal(s => ({ ...s, tempValue: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={() => setSettingsModal({ isOpen: false, tempMode: false, tempValue: 0 })}>Cancel</button>
                    <button className="btn btn-primary" onClick={onApply}>Apply settings</button>
                </div>
            </div>
        </div>
    );
};
