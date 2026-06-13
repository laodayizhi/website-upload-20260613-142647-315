(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      if (slides.length < 2) {
        return;
      }

      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        window.clearInterval(timer);
        showSlide(index);
        startTimer();
      });
    });

    startTimer();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var searchInput = scope.querySelector('[data-search]');
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
    var items = Array.prototype.slice.call(scope.querySelectorAll('.filter-item'));
    var empty = scope.querySelector('[data-empty]');
    var activeFilter = 'all';

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var visible = 0;

      items.forEach(function (item) {
        var haystack = (item.getAttribute('data-search') || '').toLowerCase();
        var textMatch = !query || haystack.indexOf(query) !== -1;
        var filterMatch = activeFilter === 'all' || haystack.indexOf(activeFilter) !== -1;
        var shouldShow = textMatch && filterMatch;

        item.hidden = !shouldShow;

        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = (button.getAttribute('data-filter') || 'all').toLowerCase();

        buttons.forEach(function (otherButton) {
          otherButton.classList.toggle('is-active', otherButton === button);
        });

        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
  });
})();
