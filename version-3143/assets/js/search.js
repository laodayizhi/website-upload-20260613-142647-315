(function () {
    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get('q') || '').trim();
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function renderCard(item) {
        return '<article class="movie-card">' +
            '<a href="' + escapeHtml(item.url) + '" class="movie-poster">' +
            '<span class="cover-layer"></span>' +
            '<img class="cover-img" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" data-cover>' +
            '<span class="play-badge">▶</span>' +
            '<span class="category-badge">' + escapeHtml(item.category) + '</span>' +
            '</a>' +
            '<div class="movie-info">' +
            '<a class="movie-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a>' +
            '<p>' + escapeHtml(item.text) + '</p>' +
            '<div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>' +
            '</div>' +
            '</article>';
    }

    function run() {
        var q = getQuery();
        var input = document.querySelector('.large-search input[name="q"]');
        var title = document.getElementById('search-title');
        var results = document.getElementById('search-results');
        var data = window.SEARCH_INDEX || [];
        if (input) {
            input.value = q;
        }
        if (!q || !results) {
            return;
        }
        var words = q.toLowerCase().split(/\s+/).filter(Boolean);
        var matched = data.filter(function (item) {
            var haystack = [item.title, item.category, item.year, item.region, item.genre, item.text, (item.tags || []).join(' ')].join(' ').toLowerCase();
            return words.every(function (word) {
                return haystack.indexOf(word) !== -1;
            });
        }).slice(0, 96);
        if (title) {
            title.innerHTML = '<span class="section-dot">◆</span><h2>搜索结果</h2>';
        }
        if (!matched.length) {
            results.className = 'empty-result';
            results.innerHTML = '<p>暂未匹配到相关影片，可尝试更换关键词。</p>';
            return;
        }
        results.className = 'movie-grid four-col';
        results.innerHTML = matched.map(renderCard).join('');
        results.querySelectorAll('img[data-cover]').forEach(function (img) {
            img.addEventListener('error', function () {
                img.classList.add('is-missing');
            }, { once: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
