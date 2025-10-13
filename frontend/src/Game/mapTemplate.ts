//import { Mesh, MeshBuilder, Scene, Vector3, CreateBox} from "@babylonjs/core/Legacy/legacy.js";
// import * as materials from 'babylonjs-materials';
// import * as babylon from 'babylonjs';
import { Material } from "babylonjs";
import { MapOption } from "./gameSettings.js";

export abstract class MapTemplate{
	protected readonly ground: BABYLON.Mesh;
	protected readonly limits: BABYLON.Mesh[];
	readonly type: MapOption;

	constructor(scene: BABYLON.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.limits = this.createLimits(scene);
	}

	abstract createGround(scene: BABYLON.Scene): BABYLON.Mesh;

	abstract createLimits(scene: BABYLON.Scene): BABYLON.Mesh[];

	abstract destroyRest(): void;

	destroy(): void {
		this.ground.dispose();
		for (let i = 0; i < this.limits.length; i++){
			this.limits[i].dispose();
		}
		this.destroyRest();
	}
}

export class DefaultMap extends MapTemplate {
	wallMaterial: BABYLON.StandardMaterial;
	constructor(scene: BABYLON.Scene) {
		super(scene, "default");
		this.wallMaterial = this.createGradientMaterial(scene);
		this.limits.forEach(limit => {
			limit.material = this.wallMaterial; 
		});
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("defaultground", 
			{width: 75, height: 75}, scene);
		//TEST
		//const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);
		//
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		limits.push(this.createLimit(scene, new BABYLON.Vector3(78, 3, 2.5), new BABYLON.Vector3(0, 1.5, -38)));
		limits.push(this.createLimit(scene, new BABYLON.Vector3(78, 3, 2.5), new BABYLON.Vector3(0, 1.5, 38)));
		limits.push(this.createLimit(scene, new BABYLON.Vector3(2.5, 3, 78), new BABYLON.Vector3(-38, 1.5, 0)));
		limits.push(this.createLimit(scene, new BABYLON.Vector3(2.5, 3, 78), new BABYLON.Vector3(38, 1.5, -0)));
		return limits;
	}

	createLimit(scene: BABYLON.Scene, dimension: BABYLON.Vector3, position: BABYLON.Vector3): BABYLON.Mesh {
		const newMesh = BABYLON.CreateBox("wall", {width: dimension.x, height: dimension.y, depth: dimension.z}, scene);
		newMesh.material = this.wallMaterial;
		newMesh.position = position;
		return newMesh;
	}

	private createGradientMaterial(scene: BABYLON.Scene): BABYLON.StandardMaterial {
		//const texture: BABYLON.DynamicTexture = this.createTexture(scene);
		const mat = new BABYLON.StandardMaterial("mat", scene);
		//mat.diffuseTexture = texture;
		return mat;
	}

	private createTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture{
		const texture = new BABYLON.DynamicTexture("dynamicTexture", {width:78, height:78}, scene);
		const ctx = texture.getContext();
		const grd = ctx.createLinearGradient(0, 0, 0, 78);
		grd.addColorStop(0, "red");
		grd.addColorStop(1, "blue");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 78, 78);
		texture.update();
		return texture;
	}
	
	destroyRest(): void {
		
	}
}

export class VolcanoMap extends MapTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "volcano");
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("volcanoground", 
			{width: 75, height: 75}, scene);
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++){
			newMesh = BABYLON.CreateBox("wall", {width: 10, height: 10, depth: 10}, scene);
			limits.push(newMesh);
		}
		return limits;
	}

	destroyRest(): void {
		
	}
}

export class WindyMap extends MapTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "windy");
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("windyground", 
			{width: 75, height: 75}, scene);
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++){
			newMesh = BABYLON.CreateBox("wall", {width: 10, height: 10, depth: 10}, scene);
			limits.push(newMesh);
		}
		return limits;
	}

	destroyRest(): void {
		
	}
}

export class FrozenMap extends MapTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "frozen");
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("frozenground", 
			{width: 75, height: 75}, scene);
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++){
			newMesh = BABYLON.CreateBox("wall", {width: 10, height: 10, depth: 10}, scene);
			limits.push(newMesh);
		}
		return limits;
	}

	destroyRest(): void {
		
	}
}

export class RainyMap extends MapTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "rainy");
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("rainyground", 
			{width: 75, height: 75}, scene);
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++){
			newMesh = BABYLON.CreateBox("wall", {width: 10, height: 10, depth: 10}, scene);
			limits.push(newMesh);
		}
		return limits;
	}

	destroyRest(): void {
		
	}
}