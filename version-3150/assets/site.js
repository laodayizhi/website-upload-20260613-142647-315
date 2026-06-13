(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        var showSlide = function (index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === activeIndex);
            });
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 6200);
        }
    }

    var searchAreas = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    searchAreas.forEach(function (area) {
        var input = area.querySelector('[data-search-input]');
        var buttons = Array.prototype.slice.call(area.querySelectorAll('[data-filter-button]'));
        var scope = document;
        var targetSelector = area.getAttribute('data-target');
        var activeCategory = 'all';

        if (targetSelector) {
            var scoped = document.querySelector(targetSelector);
            if (scoped) {
                scope = scoped;
            }
        }

        var cards = function () {
            return Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        };

        var empty = document.querySelector(area.getAttribute('data-empty') || '[data-empty-state]');

        var applyFilter = function () {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var shown = 0;

            cards().forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var category = card.getAttribute('data-category') || '';
                var categoryMatch = activeCategory === 'all' || category === activeCategory;
                var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
                var visible = categoryMatch && keywordMatch;

                card.style.display = visible ? '' : 'none';
                if (visible) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', shown === 0);
            }
        };

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeCategory = button.getAttribute('data-filter-button') || 'all';
                buttons.forEach(function (item) {
                    item.classList.toggle('active', item === button);
                });
                applyFilter();
            });
        });
    });

    var preparedVideos = new WeakSet();

    var prepareVideo = function (video) {
        if (!video || preparedVideos.has(video)) {
            return;
        }

        var source = video.getAttribute('data-source');
        if (!source) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }

        preparedVideos.add(video);
    };

    var startVideo = function (video, overlay) {
        prepareVideo(video);
        if (overlay) {
            overlay.classList.add('hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (overlay) {
                    overlay.classList.remove('hidden');
                }
            });
        }
    };

    var overlays = Array.prototype.slice.call(document.querySelectorAll('[data-player-target]'));
    overlays.forEach(function (overlay) {
        var targetId = overlay.getAttribute('data-player-target');
        var video = document.getElementById(targetId);
        if (!video) {
            return;
        }
        overlay.addEventListener('click', function () {
            startVideo(video, overlay);
        });
        video.addEventListener('play', function () {
            overlay.classList.add('hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                overlay.classList.remove('hidden');
            }
        });
    });
})();
