const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

const slideshow = document.querySelector(".slideshow");
const slides = Array.from(document.querySelectorAll(".slide-item"));
const track = document.querySelector(".track");
const allDots = document.querySelectorAll(".dot");

const firstSlide = slides[0].cloneNode(true);
const lastSlide = slides.at(-1).cloneNode(true);

// Constants
const PREV = -1;
const NEXT = 1;

const originLength = slides.length;

slides.unshift(lastSlide);
slides.push(firstSlide);

track.appendChild(firstSlide);
track.prepend(lastSlide);

let currentIndex = 1;
let canControl = true; // Biến quyết định next/prev được hay khong

setPosition(true);

function updateDots() {
    allDots.forEach((dot) => dot.classList.remove("active"));
    // (currentIndex - 1) vì có thêm 1 slide clone ở đầu
    // (currentIndex - 1 + originLength) % originLength để tránh giá trị âm và giới hạn trong số slide gốc
    const dotIndex = (currentIndex - 1 + originLength) % originLength;
    allDots[dotIndex].classList.add("active");
}

allDots.forEach((dot, index) => {
    dot.dataset.index = index;
    dot.addEventListener("click", () => {
        if (!canControl) return;
        currentIndex = Number(dot.dataset.index) + 1; // currentIndex = index dot + 1 (cộng thêm 1 vì mảng slides có 1 clone ở đầu)
        setPosition();
        updateDots();
    });
});

function calNewIndex(step) {
    currentIndex = (currentIndex + step + slides.length) % slides.length;

    // Lắng nghe transition kết thúc
    track.ontransitionend = () => {
        // Nếu ở slide cuối cùng
        if (currentIndex > originLength) {
            currentIndex = currentIndex - originLength;
            setPosition(true);
        }

        // Nếu ở slide đầu tiên
        if (currentIndex === 0) {
            currentIndex += originLength;
            setPosition(true);
        }

        // Cho phép prev/next
        canControl = true;
    };

    setPosition();

    updateDots();
}

function setPosition(instant = false) {
    if (!instant) {
        canControl = false; // Vô hiệu hóa prev/next khi thay đổi slide có transition
    }
    track.style.transition = instant ? "none" : "ease .5s";
    track.style.translate = `${currentIndex * 100 * -1}%`;
}

prevBtn.addEventListener("click", (e) => {
    if (!canControl) return; // Thoát hàm nếu không được phép điều khiển
    calNewIndex(PREV);
});

nextBtn.addEventListener("click", (e) => {
    if (!canControl) return; // Thoát hàm nếu không được phép điều khiển
    calNewIndex(NEXT);
});

let autoPlayId;

function enableAutoPlay() {
    autoPlayId = setInterval(() => {
        calNewIndex(NEXT);
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayId);
}

enableAutoPlay();

slideshow.addEventListener("mouseenter", () => {
    stopAutoPlay();
});

slideshow.addEventListener("mouseleave", () => {
    enableAutoPlay();
});
