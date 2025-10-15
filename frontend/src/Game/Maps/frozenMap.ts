import * as babylon from "/babylonjs/index.js";
import { MapTemplate } from "./mapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS } from "../values.js";

/**@todo this map is not configured dont mind the code */
export class FrozenMap extends MapTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "frozen");
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("frozenground", 
			{ width: MAP_SIZE.x, height: MAP_SIZE.y }, scene);
		return ground;
	}

	createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const limits: babylon.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++) {
			newMesh = babylon.CreateBox("wall", { width: 10, height: 10, depth: 10 }, scene);
			newMesh.position = new babylon.Vector3(0, 100, 0);
			limits.push(newMesh);
		}
		return limits;
	}

	/**@todo to configure */
	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS.blue;
		sun.material = sunMaterial;
		sun.position = new babylon.Vector3(-(MAP_SIZE.x / 2), MAP_SIZE.y * 0.7, -(MAP_SIZE.z / 2));
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS.blue;
		return light;
	}
	//

	destroyRest(): void {
		
	}
}