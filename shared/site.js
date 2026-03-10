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
                    <p>University of the Philippines Alumni</p>
                </div>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="./index.html"     data-page="index">Home</a></li>
                <li><a href="./about.html"     data-page="about">About</a></li>
                <li><a href="./programs.html"  data-page="programs">Programs</a></li>
                <li><a href="./events.html"    data-page="events">Events</a></li>
                <li><a href="./membership.html" data-page="membership">Membership</a></li>
                <li><a href="./community.html"  data-page="community">Community</a></li>
                <li><a href="./contact.html"   data-page="contact">Contact</a></li>
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
				<p>University of the Philippines Alumni Association of San Francisco. Serving the Bay Area UP community since 1973. Iskolar ng Bayan, united in the Bay.</p>
				<div class="footer-social">
					<a class="social-btn" href="#" aria-label="Facebook">📘</a>
					<a class="social-btn" href="#" aria-label="Instagram">📷</a>
					<a class="social-btn" href="#" aria-label="LinkedIn">💼</a>
					<a class="social-btn" href="#" aria-label="YouTube">▶️</a>
				</div>
			</div>
			<div class="footer-col">
				<h4>Community</h4>
				<ul>
					<li><a href="#alumni-stories">Alumni Stories</a></li>
					<li><a href="#news-updates">News &amp; Updates</a></li>
					<li><a href="#member-blog">Member Blog</a></li>
					<li><a href="#photo-gallery">Photo Gallery</a></li>
					<li><a href="#up-system">UP System</a></li>
				</ul>
			</div>
			<div class="footer-col">
				<h4>Organization</h4>
				<ul>
					<li><a href="./about.html">About UPAASF</a></li>
					<li><a href="./programs.html">Programs</a></li>
					<li><a href="./events.html">Events</a></li>
					<li><a href="./membership.html">Membership</a></li>
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
		<div class="footer-bottom">
			<p>© 2025 University of the Philippines Alumni Association of San Francisco. All rights reserved. | Established 1973 | 501(c)(3) Non-Profit Organization</p>
		</div>
	</footer>`;	

    /* ------------------------------------------------------------------
       2. Inject components
    ------------------------------------------------------------------ */
    function inject(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    /* ------------------------------------------------------------------
       3. Highlight the active nav link
         Page key resolution order:
           1. data-page attribute on <body>  — explicit, reliable, works in
              any environment (local file, subdirectory, dev server, etc.)
           2. Filename fallback              — derived from the URL pathname,
              e.g. "about.html" → "about"; used when no data-page is set
    ------------------------------------------------------------------ */
    function setActiveLink() {
        // Prefer the explicit data-page attribute on <body> if present;
        // fall back to parsing the filename from the URL pathname.
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
        const btn = document.getElementById('mobileMenuBtn');
        const links = document.getElementById('navLinks');
        if (!btn || !links) return;

        btn.addEventListener('click', function () {
            const isOpen = links.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when any nav link is tapped
        links.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                links.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ------------------------------------------------------------------
       5. Scroll: compact nav
    ------------------------------------------------------------------ */
    function initScrollBehavior() {
        var nav = document.getElementById('nav');
        if (!nav) return;
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 80);
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
       7. Intersection Observer for .fade-in elements
    ------------------------------------------------------------------ */
    function initFadeIn() {
        if (!window.IntersectionObserver) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.fade-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ------------------------------------------------------------------
       8. Animated stat counters
          Handles two patterns found across pages:
            a) data-target="500"  → counts 0 → 500, appends "+"
            b) Text content "500+", "$500K+", "100%"  → parses value + suffixes
          Supported suffixes: + (plus), $ (dollar prefix), K, % (percent)
          Triggered by IntersectionObserver so off-screen counters only
          animate when they scroll into view. Each counter fires once.
    ------------------------------------------------------------------ */
    function animateSingleCounter(el) {
        var text       = el.textContent.trim();
        var dataTarget = el.getAttribute('data-target');

        var hasPlus    = dataTarget !== null || text.indexOf('+') !== -1;
        var hasDollar  = text.indexOf('$') !== -1;
        var hasK       = text.indexOf('K') !== -1;
        var hasPercent = text.indexOf('%') !== -1;

        var target = dataTarget !== null
            ? parseInt(dataTarget, 10)
            : parseFloat(text.replace(/[^0-9.]/g, '')) || 0;

        if (!target) return;

        var steps     = 50;
        var duration  = 1500;
        var stepTime  = duration / steps;
        var increment = target / steps;
        var current   = 0;

        var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            var display = Math.floor(current);
            if (hasDollar)  display = '$' + display;
            if (hasK)       display = display + 'K';
            if (hasPercent) display = display + '%';
            if (hasPlus)    display = display + '+';
            el.textContent = display;
        }, stepTime);
    }

    function initStatCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        if (!window.IntersectionObserver) {
            // Fallback: animate immediately for old browsers
            counters.forEach(animateSingleCounter);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.dataset.animated) return; // run once only
                el.dataset.animated = 'true';
                observer.unobserve(el);
                animateSingleCounter(el);
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ------------------------------------------------------------------
       9. FAQ accordion
          Collapses all .faq-item siblings, toggles the clicked one.
          No-ops silently when no .faq-question elements are present.
    ------------------------------------------------------------------ */
    function initFaqAccordion() {
        var questions = document.querySelectorAll('.faq-question');
        if (!questions.length) return;

        questions.forEach(function (question) {
            question.addEventListener('click', function () {
                var faqItem = this.parentElement;
                var isActive = faqItem.classList.contains('active');

                // Collapse all
                document.querySelectorAll('.faq-item').forEach(function (item) {
                    item.classList.remove('active');
                });

                // Re-open if it wasn't already open
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    /* ------------------------------------------------------------------
       Bootstrap — run after the DOM is ready
    ------------------------------------------------------------------ */
    function init() {
        inject('site-header', NAV_HTML);
        inject('site-footer', FOOTER_HTML);
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
        initFaqAccordion();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // DOMContentLoaded already fired
    }
})();
