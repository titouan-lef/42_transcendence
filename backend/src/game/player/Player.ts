import * as babylon from "@babylonjs/core";
import { GameOptions, GameSettings } from "../settings/GameSettings.js";
import { PLAYER_DIMENSION, MAP_SIZE, WALL_WIDTH, PLAYER_MASS, PLAYER_RESTITUTION, PLAYER_MOVEMENT_VELOCITY, PLAYER_ROTATION_VELOCITY, PLAYER_DASH_MULT, PLAYER_DASH_CD, PLAYER_DASH_DURATION } from "../settings/values.js";
import { PlayerControls, Position, DataMessage, Rotation, EmoteChoice } from "../web_sockets/types_transfert.js";

abstract class Player {
	private readonly id: 1 | 2;
	private readonly username: string;
	protected readonly player: babylon.TransformNode;
	private readonly body: babylon.PhysicsBody;
	private readonly keyPressed: Record<string, boolean> = {};
	private readonly rotatingPlayer: boolean;
	private readonly applyingSpin;
	private readonly dashingPlayer;
	private isDashing = false;
	private dashDuration = 0;
	private dashCooldown = 0;
	private readonly baseRotation: babylon.Quaternion;
	private readonly reverseRotation: babylon.Quaternion;

	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly positionObserver: babylon.Observer<babylon.Scene>;
	private linearVelocityZ = 0;
	private angularVelocityY = 0;
	private emote: EmoteChoice | undefined;

	constructor(scene: babylon.Scene, position: babylon.Vector2, options: GameOptions, id: 1 | 2, username :string) {
		this.applyingSpin = options.spin;
		this.rotatingPlayer = options.rotatingPlayer;
		this.dashingPlayer = options.dashingPlayer;

		this.keyPressed = {
			mov_right: false,
			mov_left: false,
			rot_right: false,
			rot_left: false,
			normalMode: false,
			spinMode: false,
			emoteStrong: false,
			emoteSad: false,
			emoteLol: false,
			emoteAngry: false,
			dash: false
		};

		this.player = this.setPlayer(scene, position, id);
		this.body = this.setPlayerPhysic(scene);
		this.baseRotation = this.setBaseRotation(id);
		this.reverseRotation = this.setReverseRotation(id);
		this.normalMode();
		this.id = id;
		this.username = username;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.positionObserver = this.playerObserver(scene);
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
		player.metadata = { type: "collider", playerId: id, stunDuration: 0 };
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
		if (this.player.metadata.stunDuration > 0)
			return ;
		this.body.disablePreStep = true; // desactivate body physic for this frame so rotating doesn't cancel the reset
		this.player.rotationQuaternion = this.baseRotation.clone();
		this.body.setTargetTransform(this.player.position.clone(), this.baseRotation.clone());
		this.body.disablePreStep = false;
	}

	private spinMode(): void {
		if (this.player.metadata.stunDuration > 0)
			return ;
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

	getState(): boolean {
		return this.player.metadata.stunDuration > 0;
	}

	setControls(controls: PlayerControls): void {
		this.keyPressed.mov_left = controls.mov_left;
		this.keyPressed.mov_right = controls.mov_right;
		this.keyPressed.rot_left = controls.rot_left;
		this.keyPressed.rot_right = controls.rot_right;
		this.keyPressed.normalMode = controls.normalMode;
		this.keyPressed.spinMode = controls.spinMode;
		this.keyPressed.emoteStrong = controls.emoteStrong;
		this.keyPressed.emoteSad = controls.emoteSad;
		this.keyPressed.emoteLol = controls.emoteLol;
		this.keyPressed.emoteAngry = controls.emoteAngry;
		this.keyPressed.dash = controls.dash;
		this.handleAction();
	}


	clearControls(): void {
		for (const key in this.keyPressed) {
			this.keyPressed[key] = false;
		}
	}

	getEmote(): EmoteChoice | undefined {
		return this.emote;
	}

	resetEmote(): void {
		this.emote = undefined;
	}

	private changeEmote(): void {
		if (this.keyPressed.emoteStrong)
			this.emote = EmoteChoice.STRONG;
		if (this.keyPressed.emoteSad)
			this.emote = EmoteChoice.SAD;
		if (this.keyPressed.emoteLol)
			this.emote = EmoteChoice.LOL;
		if (this.keyPressed.emoteAngry)
			this.emote = EmoteChoice.ANGRY;
	}

	private handleAction(): void {
		if (this.keyPressed.normalMode && this.rotatingPlayer)
			this.normalMode();
		if (this.keyPressed.spinMode)
			this.spinMode();
		if (this.keyPressed.emoteStrong || this.keyPressed.emoteSad || this.keyPressed.emoteLol || this.keyPressed.emoteAngry)
			this.changeEmote();
		if (this.keyPressed.dash && this.dashingPlayer && this.dashCooldown <= 0) {
			this.isDashing = true;
			this.dashDuration = PLAYER_DASH_DURATION;
			this.dashCooldown += PLAYER_DASH_CD;
		}
	}


	private playerObserver(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const distanceFromEdge = (MAP_SIZE.z / 2) - WALL_WIDTH - (PLAYER_DIMENSION.z / 2);
		const positionObserver = this.sceneObservable.add(() => {
			if (this.player.metadata.stunDuration > 0) {
				this.player.metadata.stunDuration -= scene.metadata.gameSpeed;
				this.body.setLinearVelocity(new babylon.Vector3(0, 0, 0));
				this.body.setAngularVelocity(new babylon.Vector3(0, 0, 0));
				return ;
			}
			this.linearVelocityZ = (Number(this.keyPressed.mov_right) - Number(this.keyPressed.mov_left)) * PLAYER_MOVEMENT_VELOCITY * (2 * (this.id - 1) - 1);
			if (this.rotatingPlayer)
				this.angularVelocityY = (Number(this.keyPressed.rot_right) - Number(this.keyPressed.rot_left)) * PLAYER_ROTATION_VELOCITY;
			if (this.dashCooldown > 0)
				this.dashCooldown -= scene.metadata.gameSpeed;
			if (this.isDashing) {
				this.dashDuration -= scene.metadata.gameSpeed;
				if (this.dashDuration <= 0)
					this.isDashing = false;
				this.linearVelocityZ *= PLAYER_DASH_MULT;
			}
			if (this.player.position.z <= -distanceFromEdge && this.linearVelocityZ < 0)
				this.linearVelocityZ = 0;
			if (this.player.position.z >= distanceFromEdge && this.linearVelocityZ > 0)
				this.linearVelocityZ = 0;
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