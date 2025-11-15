import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Tornado } from "./map_utils/Tornado.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS3, W_PARTICLE_NUMBER, TORNADO_INTERVAL, TORNADO_LIFETIME, WIND_FORCE, W_GLOW_INTENSITY, COLORS4, START_TIMEOUT } from "../settings/values.js";
import { WebSocket } from "ws";

export class DesertMap extends MapTemplate {
	// private readonly particles: babylon.ParticleSystem;
	private readonly tornadoIntervalId: ReturnType<typeof setInterval>;
	private readonly tornados: Tornado[] = [];
	private readonly windForce;
	private readonly windObservable: babylon.Observable<babylon.Scene>;
	private readonly windObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "desert");
		// this.glow.intensity = W_GLOW_INTENSITY;
		this.windForce = new babylon.Vector3(
			(Math.random() - 0.5) * WIND_FORCE,
			0,
			(Math.random() - 0.5) * WIND_FORCE
		);
		this.windObservable = scene.onBeforeRenderObservable;
		this.windObserver = this.applyWind(scene);
		// this.particles = this.createParticles(scene, texture.flare);
		this.tornadoIntervalId = this.tornadoInterval(scene);
		this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		this.highlightTimeout = setTimeout(() => {
			this.limits.forEach(limit => this.wallHighlight?.addMesh(limit, COLORS3.desertHighlightWall));
		}, START_TIMEOUT);
		sockets.forEach(socket => {
			this.sockets.push(socket);
		});
	}

	private applyWind(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const windObserver = this.windObservable.add(() => {
			if (this.gameStopped) {
				// this.tornados.forEach(tornado => {
				// 	tornado.stopParticles();
				// });
				return ;
			}
			scene.meshes.forEach(mesh => {
				if (!mesh.physicsBody)
					return;
				mesh.physicsBody.applyForce(
					this.windForce,
					mesh.getAbsolutePosition()
				);
			});
		});
		return windObserver;
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("desertground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		return ground;
	}


	private tornadoInterval(scene: babylon.Scene): ReturnType<typeof setInterval> {
		const tornadoIntervalId = setInterval( () => {
			if (this.gameStopped) {
				return;
			}
			const tornado = new Tornado(scene,this.tornados.length, this.windForce, this.sockets);
			this.tornados.push(tornado);
			if (this.gameStopped)
				clearInterval(this.tornadoIntervalId);
			setTimeout(() => {
				const index = this.tornados?.indexOf(tornado);
				if (index !== -1)
					this.tornados?.splice(index, 1);
			}, TORNADO_LIFETIME + 100);
			tornado.sendObjectInfos();
		}, TORNADO_INTERVAL);
		return tornadoIntervalId;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		return newMesh;
	}

	destroyRest(): void {
		clearInterval(this.tornadoIntervalId);
		while (this.tornados.length) {
			this.tornados[0].destroy();
			this.tornados.splice(0, 1);
		}
		this.windObservable.remove(this.windObserver);
	}
}
