class CelestineFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Default to current directory if not provided
        const rootPath = this.getAttribute('root-path') || '.';
        
        this.innerHTML = `
        <footer style="padding: 40px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 60px;">
            
            <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 24px;">
                <a href="https://github.com/vero-code/celestine" target="_blank" aria-label="GitHub" style="color: #a0a0a0; font-size: 1.5rem; transition: color 0.3s;">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/veron_code" target="_blank" aria-label="X (Twitter)" style="color: #a0a0a0; font-size: 1.5rem; transition: color 0.3s;">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://devpost.com/software/celestine-rg16km" target="_blank" aria-label="Devpost" style="color: #a0a0a0; font-size: 1.5rem; transition: color 0.3s;">
                    <i class="fas fa-cube"></i>
                </a>
            </div>

            <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
                &copy; 2026 Celestine by Veronika Kashtanova. <br>Built for the Future.
            </p>

            <div style="display: flex; justify-content: center; gap: 20px; align-items: center; flex-wrap: wrap;">
                <a href="${rootPath}/legal/privacy.html" style="color: #666; text-decoration: none; font-size: 0.8rem; transition: color 0.3s;">Privacy Policy</a>
                <span style="color: #333;">|</span>
                <a href="${rootPath}/legal/terms.html" style="color: #666; text-decoration: none; font-size: 0.8rem; transition: color 0.3s;">Terms of Service</a>
                <span style="color: #333;">|</span>
                <a href="https://devpost.com/software/celestine-rg16km" target="_blank" style="color: #666; text-decoration: none; font-size: 0.8rem; transition: color 0.3s;">
                    View on Devpost
                </a>
            </div>
        </footer>
        `;
    }
}

customElements.define('celestine-footer', CelestineFooter);
