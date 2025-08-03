// parser.js
export function parseSlyke(code) {
  console.log("📦 Starte Parsing...");

  const ast = [];
  const stack = [];
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  for (const line of lines) {
    // Öffnende Tags wie: popup { oder App(title: "Meine App") {
    if (line.endsWith("{")) {
      const tagMatch = line.match(/^([A-Za-z0-9]+)(\((.*)\))?/);
      if (!tagMatch) continue;

      const tag = tagMatch[1];
      const props = {};

      // Props in runden Klammern parsen
      if (tagMatch[3]) {
        const propsRaw = tagMatch[3].split(",").map((p) => p.trim());
        for (const prop of propsRaw) {
          const [key, val] = prop.split(":").map((s) => s.trim());
          if (key && val) props[key] = val.replace(/"/g, "");
        }
      }

      const node = { tag, props, children: [] };

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node);
      } else {
        ast.push(node);
      }

      stack.push(node);
    }
    // Schließende geschweifte Klammer
    else if (line === "}") {
      stack.pop();
    }
    // Properties in Zeilen wie: backgroundColor: "black"
    else if (line.includes(":")) {
      const [key, val] = line.split(":").map((s) => s.trim());
      if (stack.length > 0) {
        stack[stack.length - 1].props[key] = val.replace(/"/g, "");
      }
    }
  }

  console.log("🌳 Parser AST:", JSON.stringify(ast, null, 2));
  return ast;
}
