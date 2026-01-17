class CelestineFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Default to current directory if not provided
        const rootPath = this.getAttribute('root-path') || '.';
        
        this.innerHTML = `
        <footer class="text-center mt-60">
            
            <div class="flex-center flex-gap-25 mb-20">
                <a href="https://github.com/vero-code/celestine" target="_blank" aria-label="GitHub" class="social-footer-link">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/veron_code/status/2005223530691235959" target="_blank" aria-label="X (Twitter)" class="social-footer-link">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://devpost.com/software/celestine-rg16km" target="_blank" aria-label="Devpost" class="social-footer-link">
                    <i class="fas fa-cube"></i>
                </a>
            </div>

            <p class="copyright-text">
                &copy; 2026 Celestine by Veronika Kashtanova. <br>Built for the Future.
            </p>

            <div class="flex-center flex-gap-20 nowrap">
                <a href="${rootPath}/legal/privacy.html" class="legal-link">Privacy Policy</a>
                <span class="legal-sep">|</span>
                <a href="${rootPath}/legal/terms.html" class="legal-link">Terms of Service</a>
                <span class="legal-sep">|</span>
                <a href="https://devpost.com/software/celestine-rg16km" target="_blank" class="legal-link">
                    View on Devpost
                </a>
            </div>
        </footer>

        <a href="#" class="back-to-top" id="backToTop">
            <i class="fas fa-chevron-up"></i>
        </a>
        `;

        // Back to top logic
        const backToTop = this.querySelector('#backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

customElements.define('celestine-footer', CelestineFooter);
