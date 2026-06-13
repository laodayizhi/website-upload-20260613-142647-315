(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    ready(function () {
        var header = document.querySelector(".site-header");
        var mobileToggle = document.querySelector(".mobile-toggle");
        var mobileNav = document.querySelector(".mobile-nav");

        function onScroll() {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 18);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener("click", function () {
                var next = !mobileNav.classList.contains("is-open");
                mobileNav.classList.toggle("is-open", next);
                mobileToggle.setAttribute("aria-expanded", next ? "true" : "false");
            });
        }

        document.querySelectorAll(".library-filter").forEach(function (panel) {
            var target = document.querySelector(panel.getAttribute("data-target"));
            if (!target) {
                return;
            }

            var input = panel.querySelector("[data-filter-search]");
            var yearSelect = panel.querySelector("[data-filter-year]");
            var typeSelect = panel.querySelector("[data-filter-type]");
            var sortSelect = panel.querySelector("[data-filter-sort]");
            var cards = Array.prototype.slice.call(target.querySelectorAll(".js-movie-card"));

            function applySort(mode) {
                var ordered = cards.slice();
                if (mode === "year-desc") {
                    ordered.sort(function (a, b) {
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    });
                } else if (mode === "year-asc") {
                    ordered.sort(function (a, b) {
                        return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                    });
                } else if (mode === "title") {
                    ordered.sort(function (a, b) {
                        return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-Hans-CN");
                    });
                }

                var fragment = document.createDocumentFragment();
                ordered.forEach(function (card) {
                    fragment.appendChild(card);
                });
                target.appendChild(fragment);
            }

            function update() {
                var keyword = normalize(input && input.value);
                var year = normalize(yearSelect && yearSelect.value);
                var type = normalize(typeSelect && typeSelect.value);
                var mode = sortSelect ? sortSelect.value : "default";

                applySort(mode);
                cards.forEach(function (card) {
                    var text = normalize([
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.genre,
                        card.dataset.tags,
                        card.textContent
                    ].join(" "));
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchYear = !year || normalize(card.dataset.year) === year;
                    var matchType = !type || normalize(card.dataset.type) === type;
                    card.hidden = !(matchKeyword && matchYear && matchType);
                });
            }

            [input, yearSelect, typeSelect, sortSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", update);
                    control.addEventListener("change", update);
                }
            });
        });
    });
})();
