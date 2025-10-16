declare module "*babylonjs/core/index.js" {
	export * from "@babylonjs/core";
}

declare module "*babylonjs/core/Physics/index.js" {
  export * from "@babylonjs/core/Physics";
}

declare module "*babylonjs/havok/lib/esm/HavokPhysics_es.js" {
  const HavokPhysics: () => Promise<EmscriptenModule>;
  export default HavokPhysics;
}
