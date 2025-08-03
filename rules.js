// rules.js

function applyProps(el, props) {
  for (const key in props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) continue;

    const value = props[key];

    // Falls Prop mit "on" beginnt → Event-Handler
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    }
    // CSS-Eigenschaft
    else if (key in el.style) {
      el.style[key] = value;
    }
    // Textinhalt
    else if (key === "value") {
      el.innerText = value;
    }
    // Attribut
    else {
      el.setAttribute(key, value);
    }
  }
}

// Fallback, falls render nicht übergeben wurde
function safeRender(children, root, rules, renderFn) {
  const render =
    renderFn ||
    ((nodes, parent) =>
      nodes.forEach((child) =>
        rules[child.tag]?.(child.props, child.children, parent, render)
      ));
  render(children, root);
}

export const rules = {
  App: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "App");
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  body: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "body");
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.minHeight = "100vh"; // voller Bildschirm
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  HStack: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "HStack");
    el.style.display = "flex";
    el.style.gap = "10px";
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  VStack: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "VStack");
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.gap = "10px";
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  scene: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "scene");
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  screen: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "screen");
    el.style.display = "flex";
    el.style.gap = "10px";
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  echo: (props, children, root) => {
    const el = document.createElement("span");
    el.setAttribute("data-tag", "echo");
    applyProps(el, props);
    root.appendChild(el);
  },

  popup: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "popup");
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  box: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "box");
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },

  button: (props, children, root) => {
    const el = document.createElement("button");
    applyProps(el, props);
    if (!props.onClick) {
      el.onclick = () => alert("Button geklickt!");
    }
    root.appendChild(el);
  },

  card: (props, children, root, render) => {
    const el = document.createElement("div");
    el.setAttribute("data-tag", "card");
    applyProps(el, props);
    root.appendChild(el);
    safeRender(children, el, rules, render);
  },
};
