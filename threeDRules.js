const THREE = window.THREE; // von index.html via CDN bereitgestellt

function parseColorProp(value, fallback = 0xffffff) {
  if (typeof value === "number") return value;
  if (!value) return fallback;
  if (typeof value === "string") {
    if (/^0x[0-9a-f]+$/i.test(value)) return parseInt(value);
    if (value.startsWith("#")) return parseInt(value.slice(1), 16);
    // Basic color names
    const named = {
      red: 0xff0000,
      green: 0x00ff00,
      blue: 0x0000ff,
      white: 0xffffff,
      black: 0x000000,
      yellow: 0xffff00,
      cyan: 0x00ffff,
      magenta: 0xff00ff,
    };
    if (named[value.toLowerCase()]) return named[value.toLowerCase()];
  }
  return fallback;
}

function parseNumProp(value, fallback = 0) {
  const n = parseFloat(value);
  return isNaN(n) ? fallback : n;
}

export const threeDRules = {
  "3DScene": (props, children, root, render) => {
    // Canvas-Reuse (bei Rerender)
    let canvas = root.querySelector && root.querySelector("canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      root.appendChild(canvas);
    }
    canvas.width = parseNumProp(props.width, 800);
    canvas.height = parseNumProp(props.height, 600);
    canvas.style.border = "1px solid black";

    // THREE Renderer re-init bei Rerender
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.z = parseNumProp(props.cameraZ, 5);

    // Liste von Animations-Callbacks
    const updaters = [];
    function addUpdater(fn) {
      updaters.push(fn);
    }
    function removeUpdater(fn) {
      const idx = updaters.indexOf(fn);
      if (idx >= 0) updaters.splice(idx, 1);
    }

    // Kontext für Kinder
    const ctx = {
      scene,
      camera,
      renderer,
      addUpdater,
      removeUpdater,
    };

    // Kinder rendern
    render(children, ctx);

    function animate() {
      requestAnimationFrame(animate);
      updaters.forEach((fn) => fn && fn());
      renderer.render(scene, camera);
    }
    animate();
  },

  Cube: (props, children, ctx, render) => {
    const size = parseNumProp(props.size, 1);
    const color = parseColorProp(props.color, 0x00ff00);
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
      parseNumProp(props.x, 0),
      parseNumProp(props.y, 0),
      parseNumProp(props.z, 0)
    );

    ctx.scene.add(cube);

    let rotateFn = null;
    if (props.rotate === "true" || props.rotate === true) {
      rotateFn = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      };
      ctx.addUpdater(rotateFn);
    }

    // Bei dynamischen UIs Updater entfernen:
    // (optional: hier cleanup für destroyed-Komponenten)

    // Kinder rendern
    render(children, { ...ctx, parent: cube });
  },

  Sphere: (props, children, ctx, render) => {
    const radius = parseNumProp(props.radius, 1);
    const color = parseColorProp(props.color, 0x0000ff);
    const wireframe = props.wireframe === "true" || props.wireframe === true;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe,
    });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(
      parseNumProp(props.x, 0),
      parseNumProp(props.y, 0),
      parseNumProp(props.z, 0)
    );

    ctx.scene.add(sphere);
    render(children, { ...ctx, parent: sphere });
  },

  Light: (props, children, ctx, render) => {
    const color = parseColorProp(props.color, 0xffffff);
    const intensity = parseNumProp(props.intensity, 1);
    const light = new THREE.PointLight(color, intensity, 100);
    light.position.set(
      parseNumProp(props.x, 5),
      parseNumProp(props.y, 5),
      parseNumProp(props.z, 5)
    );

    if (ctx.parent) {
      ctx.parent.add(light);
    } else {
      ctx.scene.add(light);
    }
    render(children, { ...ctx, parent: light });
  },
};
