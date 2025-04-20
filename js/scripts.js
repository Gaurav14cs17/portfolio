/*!
    Enhanced Portfolio Scripts
    Version: 2.0.0
    Features: Better performance, modern JS practices, and improved animations
*/

(function($) {
    'use strict';

    // Remove no-js class immediately
    document.documentElement.classList.remove('no-js');

    // Cache frequently used elements
    const $html = $('html');
    const $body = $('body');
    const $header = $('header');
    const $lead = $('#lead');

    // Smooth scrolling with requestAnimationFrame for better performance
    const smoothScroll = (target, duration = 500) => {
        const targetPosition = $(target).offset().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Easing function for smooth scrolling
        const easeInOutQuad = (t, b, c, d) => {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    // Animate to section when nav is clicked
    $('header a').on('click', function(e) {
        if ($(this).hasClass('no-scroll')) return;
        
        e.preventDefault();
        const target = $(this).attr('href');
        
        // Calculate scroll duration based on distance
        const scrollDistance = Math.abs(window.pageYOffset - $(target).offset().top);
        const duration = Math.min(Math.max(scrollDistance / 2, 300), 1000); // Clamp between 300-1000ms
        
        smoothScroll(target, duration);

        // Hide mobile menu if active
        if ($header.hasClass('active')) {
            $header.removeClass('active');
            $body.removeClass('active');
        }
    });

    // Scroll to top with smooth animation
    $('#to-top').on('click', () => {
        smoothScroll('body', 500);
    });

    // Scroll to first element below hero
    $('#lead-down span').on('click', () => {
        const target = $lead.next();
        smoothScroll(target, 500);
    });

    // Enhanced timeline creation
    const createTimeline = () => {
        const $timeline = $('#experience-timeline');
        if (!$timeline.length) return;

        $timeline.children('div').each(function() {
            const $this = $(this);
            const date = $this.data('date');
            
            // Wrap content in timeline structure
            $this.addClass('vtimeline-content')
                 .wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
            
            // Add icon and date if exists
            const $point = $this.parent();
            $point.prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
            
            if (date) {
                $point.prepend(`<span class="vtimeline-date">${date}</span>`);
            }
        });
    };

    // Mobile menu toggle
    const initMobileMenu = () => {
        $('#mobile-menu-open').on('click', () => {
            $header.addClass('active');
            $body.addClass('active');
        });

        $('#mobile-menu-close').on('click', () => {
            $header.removeClass('active');
            $body.removeClass('active');
        });
    };

    // Load additional projects
    const initProjectLoader = () => {
        $('#view-more-projects').on('click', function(e) {
            e.preventDefault();
            $(this).fadeOut(300, () => {
                $('#more-projects').fadeIn(300);
            });
        });
    };

    // Intersection Observer for lazy loading/animations
    const initIntersectionObserver = () => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            $('.animate-on-scroll').each(function() {
                observer.observe(this);
            });
        }
    };

    // Initialize all functions
    $(document).ready(() => {
        createTimeline();
        initMobileMenu();
        initProjectLoader();
        initIntersectionObserver();
        
        // Add smooth transition when clicking on links
        $('a[href^="#"]').not('.no-scroll').on('click', function(e) {
            e.preventDefault();
            smoothScroll($(this).attr('href'), 800);
        });
    });

    // Debounce scroll events for performance
    let scrollTimeout;
    $(window).on('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based effects here
        }, 100);
    });

})(jQuery);
