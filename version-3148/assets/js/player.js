(function () {
    function showState(shell, text) {
        var state = shell.querySelector(".player-state");
        if (!state) {
            return;
        }
        state.textContent = text || "";
        state.classList.toggle("is-visible", Boolean(text));
        if (text) {
            window.clearTimeout(state.hideTimer);
            state.hideTimer = window.setTimeout(function () {
                state.classList.remove("is-visible");
            }, 2400);
        }
    }

    window.initializeMoviePlayer = function (videoId, sourceUrl, posterUrl) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }

        var shell = video.closest(".player-shell") || document;
        var overlay = shell.querySelector(".play-overlay");
        var prepared = false;
        var hlsInstance = null;

        if (posterUrl) {
            video.poster = posterUrl;
        }

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (data && data.fatal) {
                        showState(shell, "播放暂时不可用，请稍后再试");
                    }
                });
            } else {
                video.src = sourceUrl;
            }
        }

        function start() {
            prepare();
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    showState(shell, "请再次点击播放");
                });
            }
        }

        function toggle() {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }

        video.addEventListener("click", toggle);
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (overlay && !video.ended) {
                overlay.classList.remove("is-hidden");
            }
        });
        video.addEventListener("ended", function () {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };
})();
