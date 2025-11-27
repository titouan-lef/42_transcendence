import * as babylon from "@babylonjs/core";
import { GameSettings } from "../settings/GameSettings.js";
import { PLAYER_DIMENSION, MAP_SIZE, WALL_WIDTH, PLAYER_MASS, PLAYER_RESTITUTION, PLAYER_MOVEMENT_VELOCITY, PLAYER_ROTATION_VELOCITY } from "../settings/values.js";
import { PlayerControls, Position, DataMessage, Rotation } from "../web_sockets/types_transfert.js";

abstract class Player {
	private readonly id: 1 | 2;
	private readonly username: string;
	protected readonly player: babylon.TransformNode;
	private readonly body: babylon.PhysicsBody;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	private readonly rotatingPlayer: boolean;
	private readonly applyingSpin;
	private readonly baseRotation: babylon.Quaternion;
	private readonly reverseRotation: babylon.Quaternion;

	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly positionObserver: babylon.Observer<babylon.Scene>;
	private linearVelocityZ = 0;
	private angularVelocityY = 0;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings, id: 1 | 2, username :string) {
		this.applyingSpin = gameSettings.spin;
		this.rotatingPlayer = gameSettings.rotatingPlayer;
		this.player = this.setPlayer(scene, position, id);
		this.body = this.setPlayerPhysic(scene);
		this.baseRotation = this.setBaseRotation(id);
		this.reverseRotation = this.setReverseRotation(id);
		this.normalMode();
		this.id = id;
		this.username = username;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.positionObserver = this.playerObserver();
	}

	private setPlayer(scene: babylon.Scene, position: babylon.Vector2, id: 1 | 2): babylon.TransformNode {
		const player = new babylon.TransformNode("player", scene);

		const normal = babylon.MeshBuilder.CreateBox("normal", { width: PLAYER_DIMENSION.x / 2, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		normal.position.x = -PLAYER_DIMENSION.x / 4;
		normal.metadata = { face: "normal" };
		normal.parent = player;

		const spinEffect = babylon.MeshBuilder.CreateBox("spinEffect", { width: PLAYER_DIMENSION.x / 2, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		spinEffect.position.x = PLAYER_DIMENSION.x / 4;
		if (this.applyingSpin) {
			spinEffect.metadata = { face: "spinEffect" };
		} else {
			spinEffect.metadata = { face: "normal" };
		}
		spinEffect.parent = player;

		player.position.x = position.x;
		player.position.y = position.y;
		player.metadata = { type: "collider", playerId: id };
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

	private setReverseRotation(playersNumber: number): babylon.Quaternion {
		return playersNumber === 2 ? babylon.Quaternion.Identity() : babylon.Quaternion.FromEulerAngles(0, Math.PI, 0);
	}

	private normalMode(): void {
		this.body.disablePreStep = true; // desactivate body physic for this frame so rotating doesn't cancel the reset
		this.player.rotationQuaternion = this.baseRotation.clone();
		this.body.setTargetTransform(this.player.position.clone(), this.baseRotation.clone());
		this.body.disablePreStep = false;
	}

	private spinMode(): void {
		this.body.disablePreStep = true; // desactivate body physic for this frame so rotating doesn't cancel the reset
		this.player.rotationQuaternion = this.reverseRotation.clone();
		this.body.setTargetTransform(this.player.position.clone(), this.reverseRotation.clone());
		this.body.disablePreStep = false;
	}

	getId(): 1 | 2 {
		return this.id;
	}

	getName(): string {
		return this.username;
	}

	getPosition(): Position {
		return { x: this.player.position.x, y: this.player.position.y, z: this.player.position.z };
	}

	getRotation(): Rotation {
		const q = this.player.rotationQuaternion;
		if (!q)
			return { x: 0, y: 0, z: 0, w: 1 };
		return { x: q.x, y: q.y, z: q.z, w: q.w };
	}

	setControls(controls: PlayerControls): void {
		this.keyPressed[0] = controls.mov_left;
		this.keyPressed[1] = controls.mov_right;
		this.keyPressed[2] = controls.rot_left;
		this.keyPressed[3] = controls.rot_right;
		this.keyPressed[4] = controls.normalMode;
		this.keyPressed[5] = controls.spinMode;
		this.handleAction();
	}

	clearControls(): void {
		this.keyPressed[0] = false;
		this.keyPressed[1] = false;
		this.keyPressed[2] = false;
		this.keyPressed[3] = false;
		this.keyPressed[4] = false;
		this.handleAction();
	}

	private handleAction(): void {
		this.linearVelocityZ = (Number(this.keyPressed[1]) - Number(this.keyPressed[0])) * PLAYER_MOVEMENT_VELOCITY * (2 * (this.id - 1) - 1);
		if (this.rotatingPlayer)
			this.angularVelocityY = (Number(this.keyPressed[3]) - Number(this.keyPressed[2])) * PLAYER_ROTATION_VELOCITY; /** @todo chaeck if valid for both single and dual player */
		if (this.keyPressed[4] && this.rotatingPlayer)
			this.normalMode();
		if (this.keyPressed[5] && this.applyingSpin)
			this.spinMode();
	}

	private playerObserver(): babylon.Observer<babylon.Scene> {
		const distanceFromEdge = (MAP_SIZE.z / 2) - WALL_WIDTH - (PLAYER_DIMENSION.z / 2);
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
		this.body?.shape?.dispose();
		this.body?.dispose();
		this.player?.getChildMeshes().forEach(child => {
			child.material?.dispose();
			child.dispose();
		});
		this.player?.dispose();
	}

	abstract send(message: DataMessage): Promise<void>;
}

export { Player };
