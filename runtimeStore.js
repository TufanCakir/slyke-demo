export const store = {};

export function setVar(name, value) {
  store[name] = value;
}

export function getVar(name) {
  return store[name];
}

export function incVar(name) {
  if (typeof store[name] === "number") {
    store[name]++;
  } else {
    store[name] = 1;
  }
  return store[name];
}
