import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerSettings } from "../settings/GameSettings.js";
import { PLAYER_DIMENSION, COLORS3, MAP_SIZE, WALL_WIDTH, PLAYER_MASS, PLAYER_RESTITUTION, PLAYER_MOVEMENT_VELOCITY, PLAYER_ROTATION_VELOCITY, PLAYER_TRAIL_INTERVAL, PLAYER_TRAIL_ON } from "../settings/values.js";
import { PlayerControls, Position, DataMessage } from "../../web_sockets/types_transfert.js";
import { WebSocket } from "ws";
//import { PhysicsBody } from "babylonjs";

export class Player {
	private readonly player: babylon.TransformNode;
	private readonly username: string;
	private readonly socket: WebSocket;
	private readonly body: babylon.PhysicsBody;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	private readonly rotatingPlayer: boolean;
	private readonly applyingSpin;
	private readonly baseRotation: babylon.Quaternion;
	// private readonly playerTrails: PlayerTrail[] = [];
	// private trailIntervalId: ReturnType<typeof setInterval> | null = null;

	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly positionObserver: babylon.Observer<babylon.Scene>;
	private linearVelocityZ = 0;
	private angularVelocityY = 0;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings, settings: PlayerSettings) {
		this.applyingSpin = gameSettings.spin;
		this.rotatingPlayer = gameSettings.rotatingPlayer;
		this.player = this.setPlayer(scene, position);
		this.body = this.setPlayerPhysic(scene);
		this.baseRotation = this.setBaseRotation(settings.playerId);
		this.resetPlayerRotation();
		
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.positionObserver = this.playerObserver();

		this.username = settings.username;
		this.socket = settings.socket;

		// if (PLAYER_TRAIL_ON)
		// 	this.trailIntervalId = this.setTrail(scene);
	}

	private setPlayer(scene: babylon.Scene, position: babylon.Vector2): babylon.TransformNode {
		const player = new babylon.TransformNode("player", scene);

		const normal = babylon.MeshBuilder.CreateBox("normal", { width: PLAYER_DIMENSION.x / 2, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		const normalMaterial = new babylon.StandardMaterial("normalMat", scene);;
		normalMaterial.emissiveColor = COLORS3.playerEmissiveNormalFace;
		normal.material = normalMaterial;
		normal.position.x = -PLAYER_DIMENSION.x / 4;
		normal.renderingGroupId = 1;
		normal.metadata = { face: "normal" };
		normal.parent = player;

		const spinEffect = babylon.MeshBuilder.CreateBox("spinEffect", { width: PLAYER_DIMENSION.x / 2, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		const spinEffectMaterial = new babylon.StandardMaterial("spinEffectMat", scene);;
		spinEffect.material = spinEffectMaterial;
		spinEffect.position.x = PLAYER_DIMENSION.x / 4;
		spinEffect.renderingGroupId = 1;
		if (this.applyingSpin) {
			spinEffectMaterial.emissiveColor = COLORS3.playerEmissiveSpinEffectFace;
			spinEffect.metadata = { face: "spinEffect" };
		} else {
			spinEffectMaterial.emissiveColor = COLORS3.playerEmissiveNormalFace;
			spinEffect.metadata = { face: "normal" };
		}
		spinEffect.parent = player;

		player.position.x = position.x;
		player.position.y = position.y;
		player.metadata = { type: "collider" };
		return player;
	}

	private setPlayerPhysic(scene: babylon.Scene): babylon.PhysicsBody {
		const newBody = new babylon.PhysicsBody(this.player, babylon.PhysicsMotionType.ANIMATED, false, scene);
		newBody.setMassProperties({ 
			mass: PLAYER_MASS, 
			centerOfMass: babylon.Vector3.Zero()
		});

		const shape = new babylon.PhysicsShapeBox(babylon.Vector3.Zero(), this.baseRotation, PLAYER_DIMENSION, scene);
		shape.material = { restitution: PLAYER_RESTITUTION, friction: 0 };
		newBody.shape = shape;
		return newBody;
	}

	private setBaseRotation(playersNumber: number): babylon.Quaternion {
		return playersNumber === 2 ? babylon.Quaternion.FromEulerAngles(0, Math.PI, 0) : babylon.Quaternion.Identity();
	}

	private resetPlayerRotation(): void {
		this.body.disablePreStep = true; // desactivate body physic for this frame so rotating doesn't cancel the reset
		this.player.rotationQuaternion = this.baseRotation.clone();
		this.body.setTargetTransform(this.player.position.clone(), this.baseRotation.clone());
		this.body.disablePreStep = false;
	}

	// private setTrail(scene: babylon.Scene): ReturnType<typeof setInterval> {
	// 	const trailIntervalId = setInterval(() => {
	// 		this.playerTrails.push(new PlayerTrail(scene, this.player));
	// 		while (this.playerTrails.length && this.playerTrails[0].hasDisappeared()) {
	// 			this.playerTrails.splice(0, 1);
	// 		}
	// 	}, PLAYER_TRAIL_INTERVAL);
	// 	return trailIntervalId;
	// }

	getName(): string {
		return this.username;
	}

	getPosition(): Position {
		return { x: this.player.position.x, y: this.player.position.y, z: this.player.position.z };
	}

	async send(message: DataMessage): Promise<void> {
		this.socket?.send(JSON.stringify(message));
	}

	async closeSocket(): Promise<void> {
		this.socket?.close();
	}

	async defineCloseAction(fn: () => void): Promise<void> {
		this.socket.on("close", fn);
	}

	setControls(controls: PlayerControls): void {
		this.keyPressed[0] = controls.mov_left;
		this.keyPressed[1] = controls.mov_right;
		this.keyPressed[2] = controls.rot_left;
		this.keyPressed[3] = controls.rot_right;
		this.keyPressed[4] = controls.apply_effect;
	}

	handleAction(): void {
		this.linearVelocityZ = (+this.keyPressed[1] - +this.keyPressed[0]) * PLAYER_MOVEMENT_VELOCITY;
		if (this.rotatingPlayer)
			this.angularVelocityY = (+this.keyPressed[3] - +this.keyPressed[2]) * PLAYER_ROTATION_VELOCITY;
		if (this.keyPressed[4] && this.rotatingPlayer)
			this.resetPlayerRotation();
	}

	private playerObserver(): babylon.Observer<babylon.Scene> {
		const distanceFromEdge = (MAP_SIZE.z / 2) - (WALL_WIDTH * 2) - (PLAYER_DIMENSION.z / 2);
		const positionObserver = this.sceneObservable.add(() => {
			if (this.player.position.z < -distanceFromEdge && this.linearVelocityZ === -PLAYER_MOVEMENT_VELOCITY)
				this.linearVelocityZ += PLAYER_MOVEMENT_VELOCITY;
			if (this.player.position.z > distanceFromEdge && this.linearVelocityZ === PLAYER_MOVEMENT_VELOCITY)
				this.linearVelocityZ -= PLAYER_MOVEMENT_VELOCITY;
			this.body.setLinearVelocity(new babylon.Vector3(0, 0, this.linearVelocityZ));
			this.body.setAngularVelocity(new babylon.Vector3(0, this.angularVelocityY, 0));
		});
		return positionObserver;
	}

	destroy(): void {
		this.sceneObservable.remove(this.positionObserver);
		// if (this.trailIntervalId)
		// 	clearInterval(this.trailIntervalId);
		// while (this.playerTrails.length) {
		// 	this.playerTrails[0]?.destroy();
		// 	this.playerTrails?.splice(0, 1);
		// }
		this.body?.shape?.dispose();
		this.body?.dispose();
		this.player?.getChildMeshes().forEach(child => {
			child.material?.dispose();
			child.dispose();
		});
		this.player?.dispose();
		this.socket?.close();
	}
}
