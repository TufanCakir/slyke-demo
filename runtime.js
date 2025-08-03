// slyke/runtime.js

function runtimeRenderer(node, rules, root) {
  if (!node) return;

  const { tag, props, children } = node;
  console.log("🔎 Rendere Node:", tag, props);

  if (rules[tag]) {
    rules[tag](props || {}, children || [], root, (childNodes, parent) =>
      childNodes.forEach((child) => runtimeRenderer(child, rules, parent))
    );
  } else {
    console.warn("❌ Keine Regel für:", tag);
  }
}

// erzeugt eine Runtime mit Regeln
function createRuntime(rules) {
  return function run(ast, root) {
    console.log("🚀 Starte Rendering des AST:", ast);
    ast.forEach((node) => runtimeRenderer(node, rules, root));
  };
}

export { createRuntime };
