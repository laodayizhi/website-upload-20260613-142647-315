(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var currentSlide = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            currentSlide = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === currentSlide);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === currentSlide);
            });
        }

        function startHero() {
            if (slides.length < 2) {
                return;
            }

            timer = window.setInterval(function () {
                showSlide(currentSlide + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startHero();
            });
        });

        showSlide(0);
        startHero();

        var filterInput = document.querySelector("[data-filter-input]");
        var yearFilter = document.querySelector("[data-year-filter]");
        var typeFilter = document.querySelector("[data-type-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var emptyState = document.querySelector("[data-empty-state]");

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = filterInput ? normalize(filterInput.value) : "";
            var year = yearFilter ? normalize(yearFilter.value) : "";
            var type = typeFilter ? normalize(typeFilter.value) : "";
            var visibleCount = 0;

            cards.forEach(function (card) {
                var searchText = normalize(card.getAttribute("data-search"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var cardType = normalize(card.getAttribute("data-type"));
                var matchKeyword = !keyword || searchText.indexOf(keyword) !== -1;
                var matchYear = !year || cardYear === year;
                var matchType = !type || cardType === type;
                var shouldShow = matchKeyword && matchYear && matchType;

                card.style.display = shouldShow ? "" : "none";
                if (shouldShow) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visibleCount === 0 && cards.length > 0);
            }
        }

        if (filterInput) {
            filterInput.addEventListener("input", applyFilters);
        }
        if (yearFilter) {
            yearFilter.addEventListener("change", applyFilters);
        }
        if (typeFilter) {
            typeFilter.addEventListener("change", applyFilters);
        }
    });
})();
