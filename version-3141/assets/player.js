(function () {
    function initMoviePlayer(source) {
        var video = document.getElementById("movie-player");
        var startButton = document.getElementById("video-start");
        var hls = null;
        var attached = false;
        var requestedPlay = false;

        if (!video || !startButton || !source) {
            return;
        }

        function attachSource() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (requestedPlay) {
                        video.play().catch(function () {
                            startButton.classList.remove("is-hidden");
                        });
                    }
                });
                hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    }
                });
                return;
            }

            video.src = source;
        }

        function playVideo() {
            requestedPlay = true;
            attachSource();
            startButton.classList.add("is-hidden");
            video.play().catch(function () {
                if (window.Hls && window.Hls.isSupported()) {
                    return;
                }
                startButton.classList.remove("is-hidden");
            });
        }

        startButton.addEventListener("click", playVideo);
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener("play", function () {
            startButton.classList.add("is-hidden");
        });
        video.addEventListener("pause", function () {
            if (video.currentTime === 0) {
                startButton.classList.remove("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
