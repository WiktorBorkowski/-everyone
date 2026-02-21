const SNAKE_COUNT = 32;
const SUBSTEPS = 5;

let rafId = null;
let cleanup = null;

function wrapAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function startFlowAnimation() {
  const canvas = document.getElementById("flow-canvas");
  if (!canvas || canvas.dataset.active === "true") return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  canvas.dataset.active = "true";

  let width = 0;
  let height = 0;
  let snakes = [];

  const pageBg = getComputedStyle(document.body).backgroundColor;
  const bgMatch = pageBg.match(/\d+/g);
  const bgRgb =
    bgMatch && bgMatch.length >= 3
      ? bgMatch.slice(0, 3).join(", ")
      : "254, 254, 254";
  const fadeStrength = 0.01;

  const palette = [
    "#ff3b7a",
    "#ff8a00",
    "#ffd700",
    "#00b894",
    "#00a8ff",
    "#6c5ce7",
    "#b337ff",
    "#ff4d4d",
  ];

  function makeSnake(i) {
    const x = randomBetween(0, width);
    const y = randomBetween(0, height);
    return {
      x,
      y,
      px: x,
      py: y,
      heading: randomBetween(0, Math.PI * 2),
      turnBias: randomBetween(-0.03, 0.03),
      phase: randomBetween(0, Math.PI * 2),
      baseSpeed: randomBetween(0.8, 1.7),
      color: palette[i % palette.length],
      orbit: {
        active: false,
        cx: 0,
        cy: 0,
        radius: 0,
        ttl: 0,
        dir: Math.random() > 0.5 ? 1 : -1,
      },
    };
  }

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    width = Math.floor(window.innerWidth);
    height = Math.floor(window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = `rgba(${bgRgb}, 1)`;
    ctx.fillRect(0, 0, width, height);

    snakes = Array.from({ length: SNAKE_COUNT }, (_, i) => makeSnake(i));
  }

  function maybeStartOrbit(snake, stepScale) {
    if (snake.orbit.active || Math.random() > 0.015 * stepScale) return;
    snake.orbit.active = true;
    snake.orbit.radius = randomBetween(55, 180);
    snake.orbit.cx =
      snake.x + Math.cos(snake.heading + Math.PI / 2) * snake.orbit.radius;
    snake.orbit.cy =
      snake.y + Math.sin(snake.heading + Math.PI / 2) * snake.orbit.radius;
    snake.orbit.ttl = randomBetween(45, 140);
    snake.orbit.dir = Math.random() > 0.5 ? 1 : -1;
  }

  function updateSnake(snake, t, stepScale) {
    const prevX = snake.x;
    const prevY = snake.y;

    maybeStartOrbit(snake, stepScale);

    let turn = Math.sin(t * 0.0016 + snake.phase) * 0.07 + snake.turnBias;

    if (snake.orbit.active) {
      const tx =
        snake.orbit.cx +
        Math.cos(t * 0.003 * snake.orbit.dir + snake.phase) *
          snake.orbit.radius;
      const ty =
        snake.orbit.cy +
        Math.sin(t * 0.003 * snake.orbit.dir + snake.phase) *
          snake.orbit.radius;
      const desired = Math.atan2(ty - snake.y, tx - snake.x);
      turn += wrapAngle(desired - snake.heading) * 0.22;
      snake.orbit.ttl -= stepScale;
      if (snake.orbit.ttl <= 0) snake.orbit.active = false;
    }

    const edgePad = 70;
    if (snake.x < edgePad) turn += 0.05;
    if (snake.x > width - edgePad) turn -= 0.05;
    if (snake.y < edgePad) turn += 0.05;
    if (snake.y > height - edgePad) turn -= 0.05;

    snake.heading += turn;

    const speedBoost = Math.min(1.8, Math.abs(turn) * 24);
    const speed = (snake.baseSpeed + speedBoost) * stepScale;

    let nextX = snake.x + Math.cos(snake.heading) * speed;
    let nextY = snake.y + Math.sin(snake.heading) * speed;
    let wrapped = false;

    if (nextX < -20) {
      nextX = width + 20;
      wrapped = true;
    } else if (nextX > width + 20) {
      nextX = -20;
      wrapped = true;
    }

    if (nextY < -20) {
      nextY = height + 20;
      wrapped = true;
    } else if (nextY > height + 20) {
      nextY = -20;
      wrapped = true;
    }

    snake.x = nextX;
    snake.y = nextY;

    if (wrapped) {
      snake.px = snake.x;
      snake.py = snake.y;
      return;
    }

    snake.px = prevX;
    snake.py = prevY;

    const mx = (snake.px + snake.x) * 0.5;
    const my = (snake.py + snake.y) * 0.5;
    const bend = Math.max(-28, Math.min(28, turn * 320));
    const cpx = mx + Math.cos(snake.heading + Math.PI / 2) * bend;
    const cpy = my + Math.sin(snake.heading + Math.PI / 2) * bend;

    ctx.beginPath();
    ctx.moveTo(snake.px, snake.py);
    ctx.quadraticCurveTo(cpx, cpy, snake.x, snake.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = snake.color;
    ctx.globalAlpha = 0.9;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function tick(t) {
    // Fade old pixels by reducing alpha directly to avoid gray color buildup.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeStrength})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    for (let step = 0; step < SUBSTEPS; step += 1) {
      const stepTime = t + step * 2;
      const stepScale = 1 / SUBSTEPS;
      snakes.forEach((snake) => updateSnake(snake, stepTime, stepScale));
    }
    rafId = window.requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  rafId = window.requestAnimationFrame(tick);

  cleanup = () => {
    window.removeEventListener("resize", resize);
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
    cleanup = null;
    canvas.dataset.active = "false";
  };
}

document.addEventListener("turbo:load", startFlowAnimation);
document.addEventListener("turbo:render", startFlowAnimation);
document.addEventListener("DOMContentLoaded", startFlowAnimation);
document.addEventListener("turbo:before-cache", () => {
  if (cleanup) cleanup();
});

if (document.readyState !== "loading") {
  startFlowAnimation();
}
