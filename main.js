function toggleFiles(folderName) {
    const filesDiv = document.getElementById(folderName);
    if (filesDiv.style.display === 'none' || filesDiv.style.display === '') {
        document.querySelectorAll(".files").forEach((e) => e.style.display = 'none')
        filesDiv.style.display = 'block';
    } else {
        filesDiv.style.display = 'none';
    }
}

const el = document.querySelector(".item");

let isResizing = false;
let isDragging = false;

// Function to handle dragging of the main div
el.addEventListener("mousedown", mousedown);

function mousedown(e) {
    if (e.target.classList.contains("resizer")) return; // Prevent drag when clicking on a resizer
    isDragging = true;

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    let prevX = e.clientX;
    let prevY = e.clientY;

    function mousemove(e) {
        if (isDragging) {
            let newX = e.clientX - prevX;
            let newY = e.clientY - prevY;

            const rect = el.getBoundingClientRect();

            // Calculate new position
            let newLeft = rect.left + newX;
            let newTop = rect.top + newY;

            // Prevent moving out of the viewport
            if (newLeft < 0) newLeft = 0; // Prevent going left
            if (newTop < 0) newTop = 0; // Prevent going up
            if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width; // Prevent going right
            if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height; // Prevent going down

            el.style.left = newLeft + "px";
            el.style.top = newTop + "px";

            prevX = e.clientX;
            prevY = e.clientY;
        }
    }

    function mouseup() {
        isDragging = false;
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}

// Resizing logic
const resizers = document.querySelectorAll(".resizer");
let currentResizer;

for (let resizer of resizers) {
    resizer.addEventListener("mousedown", mousedownResizer);
}

function mousedownResizer(e) {
    e.preventDefault(); // Prevent text selection
    currentResizer = e.target;
    isResizing = true;

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener("mousemove", mousemoveResizer);
    window.addEventListener("mouseup", mouseupResizer);

    function mousemoveResizer(e) {
        const rect = el.getBoundingClientRect();
        let newWidth, newHeight;

        if (currentResizer.classList.contains("se")) { // Southeast
            newWidth = rect.width + (e.clientX - prevX);
            newHeight = rect.height + (e.clientY - prevY);
        } else if (currentResizer.classList.contains("sw")) { // Southwest
            newWidth = rect.width - (e.clientX - prevX);
            newHeight = rect.height + (e.clientY - prevY);
            el.style.left = rect.left + (e.clientX - prevX) + "px"; // Adjust left position
        } else if (currentResizer.classList.contains("ne")) { // Northeast
            newWidth = rect.width + (e.clientX - prevX);
            newHeight = rect.height - (e.clientY - prevY);
            el.style.top = rect.top + (e.clientY - prevY) + "px"; // Adjust top position
        } else { // Northwest
            newWidth = rect.width - (e.clientX - prevX);
            newHeight = rect.height - (e.clientY - prevY);
            el.style.left = rect.left + (e.clientX - prevX) + "px"; // Adjust left position
            el.style.top = rect.top + (e.clientY - prevY) + "px"; // Adjust top position
        }

        // Prevent resizing out of bounds
        if (newWidth < 50) {
            newWidth = 50; // Minimum width
            if (currentResizer.classList.contains("sw") || currentResizer.classList.contains("nw")) {
                el.style.left = rect.left + rect.width - newWidth + "px"; // Adjust left position
            }
        }
        if (newHeight < 50) newHeight = 50; // Minimum height

        // Set new dimensions
        el.style.width = newWidth + "px";
        el.style.height = newHeight + "px";

        // Adjust position to keep within bounds
        const updatedRect = el.getBoundingClientRect();
        if (parseFloat(el.style.left) < 0) {
            el.style.left = '0px';
        }
        if (parseFloat(el.style.top) < 0) {
            el.style.top = '0px';
        }
        if (updatedRect.right > window.innerWidth) {
            el.style.left = (window.innerWidth - updatedRect.width) + 'px';
        }
        if (updatedRect.bottom > window.innerHeight) {
            el.style.top = (window.innerHeight - updatedRect.height) + 'px';
        }

        prevX = e.clientX;
        prevY = e.clientY;
    }

    function mouseupResizer() {
        window.removeEventListener("mousemove", mousemoveResizer);
        window.removeEventListener("mouseup", mouseupResizer);
        isResizing = false;
    }
}

function playVideo(elem) {
    file = elem.attributes.link.value

    let span = document.querySelector('.item span');
    span.style.display = 'none'

    let video = document.querySelector('video#myVideo')
    video.style.display = "block"

    video.src = file
    video.play();
}

function toggleFullScreeen() {
    let video = document.querySelector('video#myVideo')
    if (!document.fullscreenElement) {
        video.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const video = document.getElementById('myVideo');
video.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
})
video.addEventListener('dblclick', toggleFullScreeen)
video.addEventListener('keydown', (e) => {

    e.preventDefault();
    e.stopPropagation();
    keyFunctions(e);
})


window.addEventListener('keydown', (e) => {
    e.preventDefault();
    keyFunctions(e);
})


function showSpeed(rate) {
    document.getElementById('speed').style.display = 'inline'
    document.getElementById('speed').textContent = rate + 'x'
    let x = 0
    setTimeout(()=>{
        document.getElementById('speed').style.display = 'none'
    }, 2000)
}
function showMusic(rate) {
    document.getElementById('music').style.display = 'inline'
    document.getElementById('music').textContent = rate + 'x'
    let x = 0
    setTimeout(()=>{
        document.getElementById('music').style.display = 'none'
    }, 2500)
}

function keyFunctions(e) {
    let span = document.querySelector('.item span');
    let item = document.querySelector('.item');
    if (e.keyCode == 32) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    } else if (e.keyCode == 77) {
        if (video.volume > 0) {
            video.volume = 0
        } else {
            video.volume = 1
        }
        showMusic(Math.floor(video.volume * 100))
    } else if (e.keyCode == 67) {
        if (video.controls) {
            video.controls = false
        } else {
            video.controls = true
        }
    } else if (e.keyCode == 116) {
        location.reload();
    } else if (e.ctrlKey && e.key === 'ArrowRight') {
        if (video.playbackRate < 5.5) {
            video.playbackRate = (video.playbackRate +  0.25).toFixed(2);
        }
        showSpeed(video.playbackRate)
    } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        if (video.playbackRate > 0.25) {
            video.playbackRate = (video.playbackRate -  0.25).toFixed(2);
        }
        showSpeed(video.playbackRate)
    } else if (e.keyCode == 37) {
        video.controls = false
        video.currentTime -= 10;
    } else if (e.keyCode == 38) {
        if (video.volume < 1) {
            video.volume = Math.min(1, video.volume + 0.05);
            document.getElementById('music').textContent = Math.floor(video.volume * 100)
        }
        showMusic(Math.floor(video.volume * 100))
    } else if (e.keyCode == 39) {
        video.controls = false
        video.currentTime += 10;
    } else if (e.keyCode == 40) {
        if (video.volume > 0) {
            video.volume = Math.max(0, video.volume - 0.05);
            document.getElementById('music').textContent = Math.floor(video.volume * 100)
        }
        showMusic(Math.floor(video.volume * 100))
    } else if (e.keyCode == 27) {
        video.style.display = 'none'
        video.src = ''
        span.style.display = 'initial'
    } else if (e.keyCode == 70 || e.keyCode == 122) {
        toggleFullScreeen()
    } else if (e.keyCode == 49) {
        item.style.left = 0;
        item.style.top = 0;
    } else if (e.keyCode == 50) {
        item.style.left = (window.innerWidth - item.offsetWidth) / 2 + 'px';
        item.style.top = 0;
    } else if (e.keyCode == 51) {
        item.style.left = 'initial';
        item.style.right = 0;
        item.style.top = 0;
    } else if (e.keyCode == 52) {
        item.style.left = 0;
        item.style.top = (window.innerHeight - item.offsetHeight) / 2 + 'px';
        item.style.bottom = 'initial'
        item.style.right = 'initial'
    } else if (e.keyCode == 53) {
        item.style.left = (window.innerWidth - item.offsetWidth) / 2 + 'px';
        item.style.top = (window.innerHeight - item.offsetHeight) / 2 + 'px';
        item.style.right = 'initial'
        item.style.bottom = 'initial'
    } else if (e.keyCode == 54) {
        item.style.left = 'initial';
        item.style.right = 0;
        item.style.top = (window.innerHeight - item.offsetHeight) / 2 + 'px';
        item.style.bottom = 'initial';
    } else if (e.keyCode == 55) {
        item.style.left = 0;
        item.style.top = 'initial';
        item.style.right = 'initial';
        item.style.bottom = 0;
    } else if (e.keyCode == 56) {
        item.style.left = (window.innerWidth - item.offsetWidth) / 2 + 'px';
        item.style.top = 'initial';
        item.style.right = 'initial';
        item.style.bottom = 0;
    } else if (e.keyCode == 57) {
        item.style.left = 'initial';
        item.style.top = 'initial';
        item.style.right = 0;
        item.style.bottom = 0;
    } else {
        console.log(e.keyCode);
        
    }
}