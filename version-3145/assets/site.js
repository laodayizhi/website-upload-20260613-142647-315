(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var menu = document.querySelector(".nav-menu");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterInputs = Array.prototype.slice.call(document.querySelectorAll(".filter-input"));
        var filterSelects = Array.prototype.slice.call(document.querySelectorAll(".filter-select"));
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var emptyState = document.querySelector(".empty-state");

        function matchesCard(card, text, filters) {
            var haystack = normalize([
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.dataset.tags
            ].join(" "));

            if (text && haystack.indexOf(text) === -1) {
                return false;
            }

            if (filters.type && normalize(card.dataset.type).indexOf(filters.type) === -1) {
                return false;
            }

            if (filters.year && normalize(card.dataset.year).indexOf(filters.year) === -1) {
                return false;
            }

            if (filters.region && normalize(card.dataset.region).indexOf(filters.region) === -1) {
                return false;
            }

            return true;
        }

        function applyFilters() {
            if (!cards.length) {
                return;
            }

            var text = normalize(filterInputs.map(function (input) {
                return input.value;
            }).join(" "));

            var filters = {
                type: "",
                year: "",
                region: ""
            };

            filterSelects.forEach(function (select) {
                var key = select.getAttribute("data-filter");
                if (key) {
                    filters[key] = normalize(select.value);
                }
            });

            var visible = 0;
            cards.forEach(function (card) {
                var ok = matchesCard(card, text, filters);
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        filterInputs.forEach(function (input) {
            input.addEventListener("input", applyFilters);
        });

        filterSelects.forEach(function (select) {
            select.addEventListener("change", applyFilters);
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && filterInputs.length) {
            filterInputs[0].value = query;
            applyFilters();
        }
    });

    window.initMoviePlayer = function (videoId, overlayId, mediaUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var started = false;
        var hls = null;

        if (!video || !overlay || !mediaUrl) {
            return;
        }

        function attachMedia() {
            if (started) {
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = mediaUrl;
            } else if (window.Hls && Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(mediaUrl);
                hls.attachMedia(video);
            } else {
                video.src = mediaUrl;
            }
        }

        function begin() {
            overlay.classList.add("is-hidden");
            attachMedia();
            var playAction = video.play();
            if (playAction && typeof playAction.catch === "function") {
                playAction.catch(function () {});
            }
        }

        overlay.addEventListener("click", begin);
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                begin();
            }
        });
        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
