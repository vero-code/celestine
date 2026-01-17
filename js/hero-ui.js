/**
 * Hero Section dynamic UI logic for "Living Interface"
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Agent Count oscillation
    const agentCountEl = document.getElementById('agent-count');
    const agentProgressEl = document.querySelector('.data-progress');
    
    if (agentCountEl) {
        setInterval(() => {
            const current = parseInt(agentCountEl.textContent);
            // Oscillate around 08 (7-12)
            let next = current + (Math.random() > 0.5 ? 1 : -1);
            if (next < 5) next = 6;
            if (next > 15) next = 14;
            
            agentCountEl.textContent = next.toString().padStart(2, '0');
            
            // Randomly update progress bar too
            if (agentProgressEl) {
                const progress = 40 + Math.random() * 40;
                agentProgressEl.style.width = `${progress}%`;
            }
        }, 3000);
    }

    // 2. Orbital Sync increments
    const syncPercentEl = document.getElementById('sync-percent');
    if (syncPercentEl) {
        setInterval(() => {
            let val = parseFloat(syncPercentEl.textContent);
            // Very slow increment with small jitter
            val += (Math.random() * 0.02) - 0.005;
            if (val > 99.9) val = 98.1; // reset occasionally
            syncPercentEl.textContent = val.toFixed(1) + '%';
        }, 2000);
    }

    // 3. Signal Status flicker
    const signalStatusEl = document.getElementById('signal-status');
    if (signalStatusEl) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                const original = signalStatusEl.textContent;
                signalStatusEl.textContent = 'DECRYPTING...';
                setTimeout(() => {
                    signalStatusEl.textContent = original;
                }, 800);
            }
        }, 5000);
    }

    // 4. Random HUD status changes
    const statusTextEl = document.querySelector('.status-text');
    const sectors = ['SECTOR 7G', 'ORBITAL B3', 'GROUND ZERO', 'DEEP SPACE', 'ARRAY ALPHA'];
    if (statusTextEl) {
        setInterval(() => {
            if (Math.random() > 0.8) {
                const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
                statusTextEl.textContent = `LIVE FEED // ${randomSector}`;
            }
        }, 7000);
    }

    // 5. Video Fallback Logic
    const videoIframe = document.getElementById('hero-video');
    const placeholder = document.getElementById('video-placeholder');
    const statusText = document.querySelector('.status-text');

    const handleOffline = () => {
        if (placeholder) placeholder.style.display = 'flex';
        if (statusText) statusText.textContent = 'SIGNAL LOST // OFFLINE';
    };

    const handleOnline = () => {
        // We try to show the iframe again if it was hidden
        if (videoIframe && videoIframe.getAttribute('src')) {
            // Check if iframe is actually loaded
            try {
                if (placeholder) placeholder.style.display = 'none';
                if (statusText) statusText.textContent = 'LIVE FEED // RECONNECTED';
            } catch (e) {
                // If it fails, keep placeholder
            }
        }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (!navigator.onLine) {
        handleOffline();
    }

    // Hide placeholder when iframe loads
    if (videoIframe) {
        videoIframe.onload = () => {
            if (placeholder) placeholder.style.display = 'none';
        };

        // Timeout fallback: if video doesn't load in 5 seconds and we aren't online
        setTimeout(() => {
            if (placeholder && placeholder.style.display !== 'none' && !navigator.onLine) {
                handleOffline();
            }
        }, 5000);
    }
});
