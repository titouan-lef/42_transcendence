import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerKeys, PlayerSettings } from "../settings/GameSettings.js";
import { PLAYER_DIMENSION, COLORS3, MAP_SIZE, WALL_WIDTH, PLAYER_MASS, PLAYER_RESTITUTION, PLAYER_MOVEMENT_VELOCITY, PLAYER_ROTATION_VELOCITY, PLAYER_TRAIL_INTERVAL, PLAYER_TRAIL_ON } from "../settings/values.js";
import { PlayerTrail } from "./PlayerTrail.js";
import { PlanePosition, PlayerControls, Rotation } from "../types_transfert.js";

export class Player {
	private readonly player: babylon.TransformNode;
	private readonly id: 1 | 2;
	private trailTimer = 0;
	private readonly controls: PlayerKeys;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	private readonly applyingSpin;
	private readonly playerTrails: PlayerTrail[] = [];
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings, settings: PlayerSettings) {
		this.applyingSpin = gameSettings.spin;
		this.controls = settings.playerKeys;
		this.player = this.setPlayer(scene, position);
		this.id = settings.playerId;
		if (PLAYER_TRAIL_ON) {
			this.sceneObservable = scene.onBeforeRenderObservable;
			this.sceneObserver = this.observeScene(scene);
		}
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> | null {
		if (!this.sceneObservable)
			return null;
		const sceneObserver = this.sceneObservable?.add(() => {
			this.trailTimer++;
			if (this.trailTimer >= PLAYER_TRAIL_INTERVAL) {
				this.playerTrails.push(new PlayerTrail(scene, this.player));
				while (this.playerTrails.length && this.playerTrails[0].hasDisappeared()) {
					this.playerTrails.splice(0, 1);
				}
				this.trailTimer = 0;
			}
		});
		return sceneObserver;
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

	getId(): 1 | 2 {
		return this.id;
	}

	setPosition(position: PlanePosition): void {
		this.player.position.x = position.x;
		this.player.position.z = position.z;
	}

	setRotatiton(rotation: Rotation ): void {
		if (!this.player.rotationQuaternion)
			this.player.rotationQuaternion = new babylon.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
		this.player.rotationQuaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
	}

	getPressedKeys(): PlayerControls {
		const controls: PlayerControls = {
			mov_right: this.keyPressed[0],
			mov_left: this.keyPressed[1],
			rot_right: this.keyPressed[2],
			rot_left: this.keyPressed[3],
			normalMode: this.keyPressed[4],
			spinMode: this.keyPressed[5]
		};
		return controls;
	}

	handleKeyDown(event: KeyboardEvent): PlayerControls {
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && !this.keyPressed[i])
				this.keyPressed[i] = true;
		}
		return this.getPressedKeys();
	}

	handleKeyUp(event: KeyboardEvent): PlayerControls {
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && this.keyPressed[i])
				this.keyPressed[i] = false;
		}
		return this.getPressedKeys();
	}

	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		while (this.playerTrails.length) {
			this.playerTrails[0]?.destroy();
			this.playerTrails?.splice(0, 1);
		}
		this.player?.getChildMeshes().forEach(child => {
			child.material?.dispose();
			child.dispose();
		});
		this.player?.dispose();
	}
}
