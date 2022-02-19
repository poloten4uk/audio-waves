/*
 *   Wavify
 *   JavaScript library to make some nice waves
 *   by peacepostman @ potion
 */
export function wavify(wave_element, options) {
  if (typeof options === "undefined") options = {};

  let animationInstance;

  var settings = Object.assign(
    {},
    {
      container: options.container
        ? options.container
        : document.querySelector("body"),
      // Height of wave
      height: 200,
      // Amplitude of wave
      amplitude: 100,
      // Animation speed
      speed: 0.15,
      // Total number of articulation in wave
      bones: 3,
      // Color
      color: "rgba(255,255,255, 0.20)",
    },
    options,
  );

  let container = settings.container;
  let width = container.offsetWidth;
  let wave = wave_element;

  let waveHeight = settings.height; // Position from the top of container
  let waveDelta = settings.amplitude; // Wave amplitude
  let speed = settings.speed; // Wave animation speed
  let wavePoints = settings.bones; // How many point will be used to compute our wave

  function calculateWavePoints(factor) {
    const points = [];

    for (let i = 0; i <= wavePoints; i++) {
      const x = (i / wavePoints) * width;
      const sinSeed = (factor + (i + (i % wavePoints))) * speed * 100;
      const sinHeight = Math.sin(sinSeed / 100) * waveDelta;
      const yPos = Math.sin(sinSeed / 100) * sinHeight + waveHeight;
      points.push({ x: x, y: yPos });
    }

    return points;
  }

  function buildPath(points) {
    let SVGString = "M " + points[0].x + " " + points[0].y;

    let cp0 = {
      x: (points[1].x - points[0].x) / 2,
      y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y),
    };

    SVGString +=
      " C " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      points[1].x +
      " " +
      points[1].y;

    let prevCp = cp0;
    let inverted = -1;

    for (let i = 1; i < points.length - 1; i++) {
      // let cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
      let cp1 = {
        x: points[i].x - prevCp.x + points[i].x,
        y: points[i].y - prevCp.y + points[i].y,
      };

      SVGString +=
        " C " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        points[i + 1].x +
        " " +
        points[i + 1].y;
      prevCp = cp1;
      inverted = -inverted;
    }

    return SVGString;
  }

  let lastUpdate;
  let totalTime = 0;

  function draw() {
    let now = window.Date.now();

    if (lastUpdate) {
      let elapsed = (now - lastUpdate) / 1000;
      lastUpdate = now;

      totalTime += elapsed;

      let factor = totalTime * Math.PI;
      wave.setAttribute("d", buildPath(calculateWavePoints(factor)));
    } else {
      lastUpdate = now;
    }

    animationInstance = window.requestAnimationFrame(draw);
  }

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  let redraw = debounce(function () {
    pause();
    totalTime = 0;
    width = settings.container.getBoundingClientRect().width;
    lastUpdate = false;
    play();
  }, 250);

  function boot() {
    if (!animationInstance) {
      play();
      window.addEventListener("resize", redraw);
    }
  }

  function play() {
    if (!animationInstance) {
      animationInstance = requestAnimationFrame(draw);
    }
  }

  function pause() {
    if (animationInstance) {
      cancelAnimationFrame(animationInstance);
      animationInstance = false;
    }
  }

  function cancel() {
    if (animationInstance) {
      pause();
      window.removeEventListener("resize", redraw);
      animationInstance = false;
    }
  }

  boot();

  return {
    play,
    pause,
    cancel,
  };
}
