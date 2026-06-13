import { H as Hls } from './hls-vendor-dru42stk.js';

function attachPlayer(root) {
    var video = root.querySelector('video');
    var overlay = root.querySelector('.player-overlay');
    var button = root.querySelector('.player-button');
    var streamUrl = root.getAttribute('data-stream');
    var started = false;
    var hls = null;

    function begin() {
        if (!video || !streamUrl) {
            return;
        }
        if (!started) {
            started = true;
            video.controls = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    }

    if (button) {
        button.addEventListener('click', begin);
    }
    if (overlay) {
        overlay.addEventListener('click', begin);
    }
    if (video) {
        video.addEventListener('click', function () {
            if (!started) {
                begin();
            }
        });
        video.addEventListener('ended', function () {
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
        });
    }

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}

document.querySelectorAll('.movie-player').forEach(attachPlayer);
