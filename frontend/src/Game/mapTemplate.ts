import { MapOption } from "./gameSettings.js";

export abstract class MapTemplate {
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
	constructor(scene: BABYLON.Scene) {
		super(scene, "default");
	}

	createGround(scene: BABYLON.Scene): BABYLON.Mesh {
		const ground = BABYLON.MeshBuilder.CreateGround("defaultground", 
			{width: 75, height: 75}, scene);
		return ground;
	}

	createLimits(scene: BABYLON.Scene): BABYLON.Mesh[] {
		const limits: BABYLON.Mesh[] = [];
		let newMesh;
		for (let i = 0; i < 4; i++){
			newMesh = BABYLON.CreateBox("wall", {width: 10, height: 10, depth: 10}, scene);
			newMesh.position.x = 50;
			limits.push(newMesh);
		}
		return limits;
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