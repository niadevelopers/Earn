// js/media.js

// ===============================
// MEDIA LIBRARY DATA
// Add new content by pasting a new object into the arrays below.
// ===============================

// VIDEO LIBRARY (field recordings, training clips)
const VIDEOS = [
    {
        id: "vid_001",
        title: "Hardware Store Close — 990 in 3 min",
        desc: "Full field recording. Owner had 2 employees and was losing track of stock. Used the profit visibility angle.",
        tag: "close",
        date: "28 May 2025",
        duration: "3:42",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg",
        commission: "Ksh 490"
    },
    {
        id: "vid_002",
        title: "Handling 'I Have a POS' Objection",
        desc: "Pharmacy owner refused twice before we reframed as 'complement, not replacement.' Closed at 750.",
        tag: "rejection",
        date: "15 May 2025",
        duration: "5:11",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg",
        commission: "Ksh 250"
    },
    {
        id: "vid_003",
        title: "Offline Demo Trick — No Data Mode",
        desc: "Turn off data during demo to prove offline functionality. Works every time on trust objections.",
        tag: "tip",
        date: "04 May 2025",
        duration: "2:18",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg",
        commission: "n/a"
    },
    {
        id: "vid_004",
        title: "Closing a Salon Owner (Start to Finish)",
        desc: "From cold door to activation in under 9 minutes. Used the 'net profit' question early.",
        tag: "close",
        date: "20 Apr 2025",
        duration: "8:54",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg",
        commission: "Ksh 380"
    },
    {
        id: "vid_005",
        title: "Rejection: 'Come Back Next Week' — How We Turned It",
        desc: "Owner was busy. Used the 90-second challenge. Closed same day at 850.",
        tag: "rejection",
        date: "12 Apr 2025",
        duration: "6:30",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg",
        commission: "Ksh 350"
    }
];

// AUDIO LIBRARY (recorded pitches, phone demos, mindset audio)
const AUDIOS = [
    {
        id: "aud_001",
        title: "Cold Open Template — Read Aloud (Swahili/Eng)",
        desc: "Listen to the rhythm and tone. Read along with the script panel.",
        duration: "1:24",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: "aud_002",
        title: "Discovery Questions — NEPQ Flow",
        desc: "How to ask consequence questions without sounding pushy.",
        duration: "2:10",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: "aud_003",
        title: "Closing at 990 — The Assumptive Approach",
        desc: "Word-for-word close that triggered zero resistance.",
        duration: "1:58",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

// VLOG / EXTENDED TRAINING
const VLOGS = [
    {
        id: "vlog_001",
        title: "How to Pick the Right Streets (Market Selection)",
        desc: "Walkthrough of targeting high-revenue shops vs low-footprint kiosks.",
        tag: "strategy",
        date: "1 Jun 2025",
        duration: "7:22",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg"
    },
    {
        id: "vlog_002",
        title: "Daily Routine of a Top Closer (6 Closes in a Day)",
        desc: "Behind the scenes — planning the route, handling 15 nos, and finishing strong.",
        tag: "routine",
        date: "25 May 2025",
        duration: "11:05",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg"
    },
    {
        id: "vlog_003",
        title: "Using 'Loss Aversion' in Real Time",
        desc: "Breakdown of a conversation where the client convinced themselves to buy.",
        tag: "psychology",
        date: "18 May 2025",
        duration: "5:40",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/docs/sample.mp4",
        thumb: "https://res.cloudinary.com/demo/image/upload/docs/sample.jpg"
    }
];

// Helper: render video grid
function renderVideoGrid(containerId, videoArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!videoArray || videoArray.length === 0) {
        container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--muted);">🎬 Videos will appear here after upload.</div>`;
        return;
    }
    
    let html = '';
    videoArray.forEach(video => {
        let tagClass = '';
        if (video.tag === 'close') tagClass = 'close';
        if (video.tag === 'rejection') tagClass = 'reject';
        if (video.tag === 'tip') tagClass = 'tip';
        
        html += `
            <div class="video-card" onclick="playMedia('${video.videoUrl}', '${video.title}')">
                <div class="vc-thumb" style="background: linear-gradient(145deg, var(--moss2), var(--moss)); position:relative;">
                    <div class="vc-play">▶</div>
                    <span class="vc-tag ${tagClass}">${video.tag.toUpperCase()}</span>
                    <span class="vc-duration">${video.duration}</span>
                </div>
                <div class="vc-info">
                    <div class="vc-title">${escapeHtml(video.title)}</div>
                    <div class="vc-desc">${escapeHtml(video.desc)}</div>
                    <div class="vc-meta">
                        <span>📅 ${video.date}</span>
                        ${video.commission && video.commission !== 'n/a' ? `<span>💰 ${video.commission}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderAudioList(containerId, audioArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!audioArray || audioArray.length === 0) {
        container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--muted);">🎧 Audio examples will appear here after upload.</div>`;
        return;
    }
    
    let html = '';
    audioArray.forEach(audio => {
        html += `
            <div class="audio-card" onclick="playAudio('${audio.audioUrl}', '${audio.title}', this)">
                <div class="ac-play-btn">▶</div>
                <div class="ac-info">
                    <div class="ac-title">${escapeHtml(audio.title)}</div>
                    <div class="ac-desc">${escapeHtml(audio.desc)}</div>
                </div>
                <div class="ac-waveform">
                    <div class="wf-bar"></div><div class="wf-bar"></div><div class="wf-bar"></div><div class="wf-bar"></div><div class="wf-bar"></div>
                </div>
                <div class="ac-duration">${audio.duration}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Simple HTML escape
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Audio / Video player (opens in a new tab or modal)
let currentAudio = null;
function playMedia(url, title) {
    if (!url) {
        showToast('No video URL available yet. Add via media.js', true);
        return;
    }
    window.open(url, '_blank');
    showToast(`Opening: ${title}`);
}

function playAudio(url, title, cardElement) {
    if (!url) {
        showToast('Audio not available yet', true);
        return;
    }
    
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        document.querySelectorAll('.audio-card').forEach(card => card.classList.remove('playing'));
    }
    
    const audio = new Audio(url);
    currentAudio = audio;
    audio.play().catch(e => console.log('Playback error:', e));
    
    // Highlight playing card
    document.querySelectorAll('.audio-card').forEach(card => card.classList.remove('playing'));
    if (cardElement) cardElement.classList.add('playing');
    
    audio.addEventListener('ended', () => {
        if (cardElement) cardElement.classList.remove('playing');
        currentAudio = null;
        showToast(`Finished: ${title}`);
    });
    
    showToast(`Now playing: ${title}`);
}

// Initialize all media sections
function initMediaLibrary() {
    renderVideoGrid('videoGrid', VIDEOS);
    renderVideoGrid('vlogGrid', VLOGS);
    renderAudioList('audioList', AUDIOS);
    
    // If global showToast missing, define fallback
    if (typeof window.showToast !== 'function') {
        window.showToast = function(msg, isErr) {
            console.log(msg);
            alert(msg);
        };
    }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaLibrary);
} else {
    initMediaLibrary();
}
