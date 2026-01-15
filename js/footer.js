class CelestineFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Default to current directory if not provided
        const rootPath = this.getAttribute('root-path') || '.';
        
        this.innerHTML = `
        <footer>
            <p>&copy; 2026 Celestine Project by Veronika Kashtanova. <br>Built for the Future.</p>
            <div style="margin-top: 10px; display: flex; justify-content: center; gap: 20px;">
                <a href="${rootPath}/legal/privacy.html" style="color: var(--secondary-text, #a0a0a0); text-decoration: none; font-size: 0.8rem; transition: color 0.3s;">Privacy Policy</a>
                <a href="${rootPath}/legal/terms.html" style="color: var(--secondary-text, #a0a0a0); text-decoration: none; font-size: 0.8rem; transition: color 0.3s;">Terms of Service</a>
            </div>
        </footer>
        `;
    }
}

customElements.define('celestine-footer', CelestineFooter);
