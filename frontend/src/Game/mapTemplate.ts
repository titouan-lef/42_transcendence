import { MapOption } from "./gameSettings.js";

export class MapTemplate {
	readonly mesh: BABYLON.Mesh;
	readonly type: string = "maptemplate";

	constructor(scene: BABYLON.Scene, name: string) {
		this.mesh = BABYLON.MeshBuilder.CreateGround(name, 
			{width: 75, height: 75}, scene);
	}
}

export class DefaultMap extends MapTemplate {
	readonly type: MapOption = "default";

	constructor(scene: BABYLON.Scene) {
		super(scene, "default");
	}
}

export class VolcanoMap extends MapTemplate {
	readonly type: MapOption = "volcano";

	constructor(scene: BABYLON.Scene) {
		super(scene, "volcano");
	}
}

export class WindyMap extends MapTemplate {
	readonly type: MapOption = "windy";

	constructor(scene: BABYLON.Scene) {
		super(scene, "windy");
	}
}

export class FrozenMap extends MapTemplate {
	readonly type: MapOption = "frozen";

	constructor(scene: BABYLON.Scene) {
		super(scene, "frozen");
	}
}

export class RainyMap extends MapTemplate {
	readonly type: MapOption = "rainy";

	constructor(scene: BABYLON.Scene) {
		super(scene,"rainy");
	}
}