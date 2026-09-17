import { Component } from 'react';
import { clearStoredSession } from '../utils/session.js';

// Saved games now outlive the tab, so an unrenderable one would white-screen the
// app on every visit with no way out but devtools. This gives it a door.
export class ErrorBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error, info) {
        console.error('Big 2 Tracker crashed', error, info);
    }

    render() {
        if (!this.state.failed) return this.props.children;

        return (
            <div className="crash">
                <strong>Something went wrong</strong>
                <p>The scoreboard could not be drawn. If this keeps happening, the saved games on this device may be unreadable.</p>
                <div className="crash-actions">
                    <button className="btn" onClick={() => window.location.reload()}>Reload</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => { clearStoredSession(); window.location.reload(); }}
                    >
                        Clear saved games and reload
                    </button>
                </div>
            </div>
        );
    }
}
