/**
 * UPAASF Shared Site Components
 *
 * Responsibilities:
 *  1. Inject the site-wide <nav> into #site-header
 *  2. Inject the site-wide <footer> into #site-footer
 *  3. Highlight the active nav link based on current page
 *  4. Wire up the mobile hamburger menu
 *  5. Add the nav.scrolled class on scroll
 *  6. Smooth scroll for in-page anchor links
 *  7. Intersection Observer for .fade-in elements
 *  8. Animated stat counters (.stat-number) — supports data-target and
 *     text-content patterns including $, K, + suffixes
 *  9. FAQ accordion (.faq-question / .faq-item) — auto-init when present
 * 10. Nav dropdowns — hover on desktop, tap-to-open on mobile
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1. HTML Templates
    ------------------------------------------------------------------ */
    const NAV_HTML = `
    <nav id="nav">
        <div class="nav-container">
            <a href="./index.html" class="logo" aria-label="UPAASF Home">
                <div class="logo-icon">UP</div>
                <div class="logo-text">
                    <h1>UPAASF</h1>
                    <p>University of the Philippines Alumni Association of San Francisco</p>
                </div>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="./index.html"      data-page="index">Home</a></li>
                <li><a href="./about.html"      data-page="about">About</a></li>
                <li><a href="./programs.html"   data-page="programs">Programs</a></li>
                <li><a href="./events.html"     data-page="events">Events</a></li>
                <li><a href="./membership.html" data-page="membership">Membership</a></li>
                <li><a href="./community.html"  data-page="community">Community</a></li>
                <li><a href="./contact.html"    data-page="contact">Contact</a></li>
                <li><a href="./membership.html" class="nav-cta">Join Now</a></li>
            </ul>
            <button class="mobile-menu-btn" id="mobileMenuBtn"
                    aria-label="Toggle navigation" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;

    const EXTENDED_NAV_HTML = `
    <nav id="nav">
        <div class="nav-container">
            <a href="./index.html" class="logo" aria-label="UPAASF Home">
                <div class="logo-icon">UP</div>
                <div class="logo-text">
                    <h1>UPAASF</h1>
                    <p>University of the Philippines Alumni Association of San Francisco</p>
                </div>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="./index.html"      data-page="index">Home</a></li>
                <li><a href="./about.html"      data-page="about">About</a></li>

                <!-- Programs with dropdown -->
                <li id="programsNavItem">
                    <a href="./programs.html" data-page="programs">Programs</a>
					<button class="dropdown-chevron" aria-label="Expand Programs menu" aria-expanded="false">
						<span></span>
					</button>		
                    <ul class="dropdown-menu">
                        <li>
                            <a href="./alumni-mentoring-program.html">
                                <span class="submenu-icon">🎓</span>
                                <span class="submenu-label">
                                    Alumni Mentoring Program
                                    <!-- <span>Connect with Bay Area professionals</span> -->
                                </span>
                            </a>
                        </li>
                        <li>
                            <!-- <a href="./cultural-immersion-camp.html"> -->
							<a href="./programs.html#cultural-camp">
                                <span class="submenu-icon">🎭</span>
                                <span class="submenu-label">
                                    Filipino Cultural Immersion Camp
                                    <!-- <span>Heritage &amp; traditions for youth</span> -->
                                </span>
								<span class="badge-soon">Coming Soon</span>
                            </a>
                        </li>
                        <li>
                            <!-- <a href="./speakers-series.html"> -->
							<a href="./programs.html#speakers">
                                <span class="submenu-icon">💡</span>
                                <span class="submenu-label">
                                    Speakers' Series
                                    <!-- <span>Inspiring conversations with leaders</span> -->
                                </span>
								<span class="badge-soon">Coming Soon</span>
                            </a>
                        </li>
                        <li>
                            <!-- <a href="./up-in-the-streets.html"> -->
							<a href="./programs.html#up-streets">
                                <span class="submenu-icon">🎨</span>
                                <span class="submenu-label">
                                    UP in the Streets
                                    <!-- <span>Community &amp; public art initiatives</span> -->
                                </span>
								<span class="badge-soon">Coming Soon</span>
                            </a>
                        </li>
                        <hr class="dropdown-divider">
                        <li>
                            <a href="#">
                                <span class="submenu-icon">🏅</span>
                                <span class="submenu-label">
                                    Scholarship Programs
                                    <!-- <span>Supporting UP students</span> -->
                                </span>
                                <span class="badge-soon">Coming Soon</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span class="submenu-icon">❤️</span>
                                <span class="submenu-label">
                                    Disaster Relief &amp; Philanthropy
                                    <!-- <span>Giving back to our communities</span> -->
                                </span>
                                <span class="badge-soon">Coming Soon</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li><a href="./events.html"     data-page="events">Events</a></li>
                <li><a href="./membership.html" data-page="membership">Membership</a></li>
				
				<!-- Community without dropdown -->
                <li><a href="./community.html"  data-page="community">Community</a></li>
                <!-- Community with dropdown -->
				<!--
                <li id="communityNavItem">
                    <a href="./community.html" data-page="community" class="dropdown-toggle">Community</a>
                    <ul class="dropdown-menu">
                        <li>
                            <a href="./community.html#alumni-stories">
                                <span class="submenu-icon">🌟</span>
                                <span class="submenu-label">
                                    Alumni Stories &amp; Spotlights
                                    <span>Member success &amp; journeys</span>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="./community.html#news-updates">
                                <span class="submenu-icon">📰</span>
                                <span class="submenu-label">
                                    News &amp; Updates
                                    <span>Latest bulletins &amp; press</span>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="./community.html#member-blog">
                                <span class="submenu-icon">✍️</span>
                                <span class="submenu-label">
                                    Member Blog
                                    <span>Stories written by alumni</span>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="./community.html#photo-gallery">
                                <span class="submenu-icon">📸</span>
                                <span class="submenu-label">
                                    Photo Gallery
                                    <span>Event &amp; program photos</span>
                                </span>
                            </a>
                        </li>
                        <hr class="dropdown-divider">
                        <li>
                            <a href="./community.html#up-system">
                                <span class="submenu-icon">🎓</span>
                                <span class="submenu-label">
                                    UP System Connection
                                    <span>Stay linked to alma mater</span>
                                </span>
                            </a>
                        </li>
                    </ul>
                </li>				
				-->

                <li><a href="./contact.html"    data-page="contact">Contact</a></li>
                <li><a href="./membership.html" class="nav-cta">Join Now</a></li>
            </ul>
            <button class="mobile-menu-btn" id="mobileMenuBtn"
                    aria-label="Toggle navigation" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;

    const FOOTER_HTML = `
    <footer>
        <div class="section-container">
            <p>&copy; 2026 UPAASF | University of the Philippines Alumni Association of San Francisco</p>
            <p>Established 1973 &bull; Serving the Bay Area for 50+ Years</p>
        </div>
    </footer>`;

    const EXTENDED_FOOTER_HTML = `
    <footer>
        <div class="footer-grid">
            <div class="footer-brand">
                <h3>UPAASF</h3>
                <p>University of the Philippines Alumni Association of San Francisco.
                   Serving the Bay Area UP community since 1973. Iskolar ng Bayan, united in the Bay.</p>
                <div class="footer-social">
                    <a class="social-btn" href="https://www.linkedin.com/in/up-alumni-association-of-san-francisco-upaasf-10592a276/" aria-label="Facebook">📘</a>
                    <a class="social-btn" href="https://www.instagram.com/upaa_sf/" aria-label="Instagram">📷</a>
                    <a class="social-btn" href="https://www.linkedin.com/in/up-alumni-association-of-san-francisco-upaasf-10592a276/" aria-label="LinkedIn">💼</a>
                    <a class="social-btn" href="#" aria-label="YouTube">▶️</a>
                </div>
            </div>

            <div class="footer-links-container">
            <div class="footer-col">
                <h4>Programs</h4>
                <ul>
                    <li><a href="./alumni-mentoring-program.html">Alumni Mentoring</a></li>
                    <li><a href="./programs.html#cultural-camp">Cultural Camp</a></li>
                    <li><a href="./programs.html#speakers">Speakers' Series</a></li>
                    <li><a href="./programs.html#up-streets">UP in the Streets</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Organization</h4>
                <ul>
                    <li><a href="./about.html">About UPAASF</a></li>
                    <li><a href="./events.html">Events</a></li>
                    <li><a href="./membership.html">Membership</a></li>
                    <li><a href="./community.html">Community</a></li>
                    <li><a href="./contact.html">Contact Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Resources</h4>
                <ul>
                    <li><a href="#">Member Directory</a></li>
                    <li><a href="#">Annual Reports</a></li>
                    <li><a href="#">Scholarship Fund</a></li>
                    <li><a href="#">Media Kit</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 University of the Philippines Alumni Association of San Francisco.
               All rights reserved. | Established 1973</p>
        </div>
    </footer>`;

    /* ------------------------------------------------------------------
       2. Inject nav & footer
    ------------------------------------------------------------------ */
    function injectNav(html) {
        var header = document.getElementById('site-header');
        if (header) header.innerHTML = html || NAV_HTML;
    }

    function injectFooter(html) {
        var footer = document.getElementById('site-footer');
        if (footer) footer.innerHTML = html || FOOTER_HTML;
    }

    /* ------------------------------------------------------------------
       3. Highlight active nav link
          Priority:
          1. Explicit data-page attribute on <body>
          2. Filename fallback — derived from the URL pathname,
             e.g. "about.html" → "about"; used when no data-page is set
    ------------------------------------------------------------------ */
    function setActiveLink() {
        const page = document.body.dataset.page
            || window.location.pathname.split('/').pop().replace('.html', '')
            || 'index';

        document.querySelectorAll('.nav-links a[data-page]').forEach(function (link) {
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }

    /* ------------------------------------------------------------------
       4. Mobile hamburger toggle
    ------------------------------------------------------------------ */
    function initMobileMenu() {
        const btn   = document.getElementById('mobileMenuBtn');
        const links = document.getElementById('navLinks');
        if (!btn || !links) return;

        btn.addEventListener('click', function () {
            const isOpen = links.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a nav link is tapped — but NOT when the tapped
        // link is a dropdown toggle (that's handled by initDropdowns below).
        links.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (link.classList.contains('dropdown-toggle')) return;
                links.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ------------------------------------------------------------------
       5. Scroll: compact nav + keep --nav-height in sync with actual height
          The CSS token is a static 92px approximation that matches the
          full nav. When nav gains .scrolled (padding halved) its rendered
          height shrinks to ~71px — sticky sub-navs stuck at 92px then
          show a visible gap. Updating the variable on every scroll event
          keeps the sub-nav flush regardless of nav state.
    ------------------------------------------------------------------ */
    function initScrollBehavior() {
        var nav = document.getElementById('nav');
        if (!nav) return;

        function syncNavHeight() {
            document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
        }

        // Set immediately so the value is correct before any scroll
        syncNavHeight();

        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 80);
            syncNavHeight();
            // Also sync after the nav transition finishes (transition: all 0.3s ease)
            // so the CSS variable reflects the final settled height
            clearTimeout(window._navSyncTimer);
            window._navSyncTimer = setTimeout(syncNavHeight, 320);
        }, { passive: true });
    }

    /* ------------------------------------------------------------------
       6. Smooth scroll for in-page anchor links
    ------------------------------------------------------------------ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ------------------------------------------------------------------
       7. Fade-in on scroll (Intersection Observer)
    ------------------------------------------------------------------ */
    function initFadeIn() {
        var items = document.querySelectorAll('.fade-in');
        if (!items.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        items.forEach(function (item) { observer.observe(item); });
    }

    /* ------------------------------------------------------------------
       8. Animated stat counters
          Supports: plain number, number+suffix ($, K, +, K+, $K+, etc.)
          Reads from data-target if present, otherwise parses text content.
    ------------------------------------------------------------------ */
    function initStatCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

				const validPrefixes = ['$'];
				const validSuffixes = ['K+', 'K', '%', '+'];

                var el       = entry.target;
                var raw      = el.dataset.target || el.textContent.trim();
                var prefix   = validPrefixes.find(s => raw.startsWith(s)) || '';;
				//var prefix   = raw.match(/^\$/)       ? '$'  : '';
				var suffix   = validSuffixes.find(s => raw.endsWith(s)) || '';
                //var suffix   = raw.match(/K\+?$/)     ? (raw.endsWith('+') ? 'K+' : 'K')
                //             : raw.match(/\+$/)       ? '+'  : '';
                var target   = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
                var duration = 1800;
                var start    = null;

                function step(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    var ease     = 1 - Math.pow(1 - progress, 3);
                    var current  = Math.floor(ease * target);
                    el.textContent = prefix + current.toLocaleString() + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                    else el.textContent = prefix + target.toLocaleString() + suffix;
                }

                requestAnimationFrame(step);
            });
        }, { threshold: 0.3 });

        counters.forEach(function (counter) { observer.observe(counter); });
    }

    /* ------------------------------------------------------------------
       9. FAQ accordion
          Collapses all .faq-item siblings, toggles the clicked one.
          No-ops silently when no .faq-question elements are present.
    ------------------------------------------------------------------ */
    function initFAQ() {
        var questions = document.querySelectorAll('.faq-question');
        if (!questions.length) return;

        questions.forEach(function (q) {
            q.addEventListener('click', function () {
                var item   = q.closest('.faq-item');
                var isOpen = item.classList.contains('open');

                // Close all
                document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                    openItem.classList.remove('open');
                });

                // Open clicked (unless it was already open)
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    /* ------------------------------------------------------------------
      10. Nav dropdowns
          - Desktop: CSS :hover on the <li> handles show/hide. The chevron
                     is decorative only (pointer-events: none).
          - Mobile:  The <a> navigates normally. The .dropdown-chevron
                     button exclusively toggles the panel open/closed.
          - iOS ghost-click fix: touchend fires first and sets a flag;
                     the synthetic click that iOS fires ~300ms later is
                     ignored, preventing the toggle from firing twice and
                     immediately undoing itself.
          - Tapping outside any open dropdown closes it.
    ------------------------------------------------------------------ */
    function initDropdowns() {
        ['programsNavItem', 'communityNavItem'].forEach(function (id) {
            var item = document.getElementById(id);
            if (!item) return;

            var chevron = item.querySelector('.dropdown-chevron');
            if (!chevron) return;

            // Flag that a real touch already handled this interaction.
            // Prevents the iOS ghost click (~300ms later) from toggling back.
            var touchHandled = false;

            function toggleDropdown(e) {
                e.stopPropagation();
                var isOpen = item.classList.toggle('open');
                chevron.setAttribute('aria-expanded', String(isOpen));
            }

            // touchend: handles the real finger-lift on iOS/Android.
            // preventDefault() stops the browser generating a ghost click.
            chevron.addEventListener('touchend', function (e) {
                e.preventDefault();
                touchHandled = true;
                toggleDropdown(e);
                // Reset flag after the ghost-click window (~500ms)
                setTimeout(function () { touchHandled = false; }, 500);
            });

            // click: handles mouse clicks on desktop (pointer-events: none
            // keeps this from firing for the decorative desktop chevron, but
            // pointer-events: auto in the mobile media query re-enables it as
            // a true fallback for non-iOS touch browsers).
            chevron.addEventListener('click', function (e) {
                if (touchHandled) return; // ghost click — already handled above
                toggleDropdown(e);
            });
        });

        // Close all open dropdowns when tapping/clicking anywhere outside them.
        document.addEventListener('click', function (e) {
            document.querySelectorAll('.nav-links > li.open').forEach(function (openItem) {
                if (!openItem.contains(e.target)) {
                    openItem.classList.remove('open');
                    var chevron = openItem.querySelector('.dropdown-chevron');
                    if (chevron) chevron.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* ------------------------------------------------------------------
       Init: run everything after the DOM is ready
    ------------------------------------------------------------------ */
    function init() {
        injectNav(EXTENDED_NAV_HTML);
        injectFooter(EXTENDED_FOOTER_HTML);
        setActiveLink();
						
        // Patch the "Join Now" CTA href based on the optional data-join-href
        // attribute on <body>. This allows pages with their own membership
        // section (e.g. membership.html with <body data-join-href="#join">)
        // to scroll in-page, while all other pages default to membership.html.
        // The dataset API converts data-join-href → dataset.joinHref (camelCase).
        document.querySelector('.nav-cta').setAttribute(
            'href',
            document.body.dataset.joinHref || './membership.html'
        );

        initMobileMenu();
        initScrollBehavior();
        initSmoothScroll();
        initFadeIn();
        initStatCounters();
        initFAQ();
        initDropdowns();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();  // DOMContentLoaded already fired
    }

}());
