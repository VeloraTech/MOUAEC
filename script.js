const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
let scrollPos = 0;
let animationFrameId = null;

function animate() {
  if (!track || items.length === 0) {
    animationFrameId = null;
    return;
  }

  if (document.hidden) {
    animationFrameId = null;
    return;
  }

  scrollPos -= 1.2;

  const halfTrack = track.offsetWidth / 2;
  if (Math.abs(scrollPos) >= halfTrack) {
    scrollPos = 0;
  }

  const centerX = window.innerWidth / 2;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distNormalized = (itemCenter - centerX) / centerX;
    const absDist = Math.abs(distNormalized);

    const scale = 0.75 + absDist * 0.45;
    const rotateY = distNormalized * -40;
    const translateY = absDist * -40;
    const translateZ = (1 - absDist) * -250;

    item.style.transform = `
      translateX(${scrollPos}px)
      translateY(${translateY}px)
      translateZ(${translateZ}px)
      scale(${scale})
      rotateY(${rotateY}deg)
    `;
  });

  animationFrameId = requestAnimationFrame(animate);
}

if (track && items.length) {
  animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    return;
  }

  if (!document.hidden && !animationFrameId && track && items.length) {
    animationFrameId = requestAnimationFrame(animate);
  }
});
(function () {
  const end = Date.now() + (5 * 86400 + 14 * 3600 + 22 * 60 + 8) * 1000;
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("cd-d").textContent = String(d).padStart(2, "0");
    document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
})();
