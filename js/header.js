class CelestineHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const rootPath = this.getAttribute('root-path') || '.';
        const activePage = this.getAttribute('active-page') || '';
        
        this.innerHTML = `
        <style>
            /* Scoped-ish styles for the header component */
            .cel-nav-container {
                display: flex;
                align-items: center;
            }
            .cel-nav-link {
                font-size: 1rem;
                color: var(--secondary-text, #a0a0a0);
                text-decoration: none;
                margin-right: 20px;
                vertical-align: middle;
                transition: color 0.3s;
            }
            .cel-nav-link:hover, .cel-nav-link.active {
                color: #fff;
            }
            .cel-social-link {
                color: var(--secondary-text, #a0a0a0);
                margin-left: 15px;
                font-size: 1.2rem;
                text-decoration: none;
                transition: color 0.3s;
            }
            .cel-social-link:hover {
                color: #fff;
            }
            .cel-social-link.github:hover {
                color: #fff; 
            }
            .cel-social-link.twitter:hover {
                color: #1da1f2;
            }
            
            @media (max-width: 768px) {
                .cel-nav-link { font-size: 0.9rem; margin-right: 10px; }
                .cel-social-link { display: none; }
            }
        </style>
        <header>
            <a href="${rootPath}/index.html" class="logo">Celestine</a>
            <div class="cel-nav-container">
                <a href="${rootPath}/index.html" class="cel-nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                <a href="${rootPath}/features.html" class="cel-nav-link ${activePage === 'features' ? 'active' : ''}">Features</a>
                <a href="${rootPath}/pricing.html" class="cel-nav-link ${activePage === 'pricing' ? 'active' : ''}">Pricing</a>
                <a href="${rootPath}/about.html" class="cel-nav-link ${activePage === 'about' ? 'active' : ''}">About</a>
                <a href="${rootPath}/contact.html" class="cel-nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
                
                <a href="https://github.com/vero-code/celestine" target="_blank" class="cel-social-link github"><i class="fab fa-github"></i></a>
                <a href="https://x.com/veron_code/status/2005223530691235959" target="_blank" class="cel-social-link twitter"><i class="fab fa-twitter"></i></a>
            </div>
        </header>
        `;
    }
}

customElements.define('celestine-header', CelestineHeader);
