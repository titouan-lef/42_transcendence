import * as babylon from "/babylonjs/core/index.js";
import { MapTemplate } from "./mapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS } from "../values.js";

/**@todo this map is not configured dont mind the code */
export class RainyMap extends MapTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "rainy");
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("rainyground", 
			{ width: MAP_SIZE.x, height: MAP_SIZE.y }, scene);
		return ground;
	}

	/**@todo to configure */
	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS.grey;
		sun.material = sunMaterial;
		sun.position = new babylon.Vector3(-(MAP_SIZE.x / 2), MAP_SIZE.y * 0.7, -(MAP_SIZE.z / 2));
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS.grey;
		return light;
	}

	destroyRest(): void {
		
	}
}