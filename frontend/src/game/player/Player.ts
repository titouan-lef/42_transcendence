import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerKeys, PlayerSettings } from "../settings/GameSettings.js";
import { PLAYER_DIMENSION, COLORS3, PLAYER_TRAIL_INTERVAL, PLAYER_TRAIL_ON } from "../settings/values.js";
import { PlayerTrail } from "./PlayerTrail.js";
import { PlanePosition, PlayerControls, Rotation } from "../types_transfert.js";

class Player {
	private readonly player: babylon.TransformNode;
	private readonly id: 1 | 2;
	private readonly socket: WebSocket | null = null;
	private readonly controls: PlayerKeys | null = null;
	private trailTimer = 0;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	private readonly applyingSpin;
	private readonly playerTrails: PlayerTrail[] = [];
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings, settings: PlayerSettings) {
		this.applyingSpin = gameSettings.spin;
		this.id = settings.playerId;
		this.player = this.setPlayer(scene, position);

		if (PLAYER_TRAIL_ON) {
			this.sceneObservable = scene.onBeforeRenderObservable;
			this.sceneObserver = this.observeScene(scene);
		}

		if (settings.socket && settings.playerKeys) {
			this.controls = settings.playerKeys;
			this.socket = settings.socket;
			window.addEventListener("keydown", (event: KeyboardEvent) => {
				this.handleKeyDown(event);
			});
			window.addEventListener("keyup", (event: KeyboardEvent) => {
				this.handleKeyUp(event);
			});
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
		normal.parent = player;

		const spinEffect = babylon.MeshBuilder.CreateBox("spinEffect", { width: PLAYER_DIMENSION.x / 2, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		const spinEffectMaterial = new babylon.StandardMaterial("spinEffectMat", scene);;
		spinEffect.material = spinEffectMaterial;
		spinEffect.position.x = PLAYER_DIMENSION.x / 4;
		spinEffect.renderingGroupId = 1;
		if (this.applyingSpin) {
			spinEffectMaterial.emissiveColor = COLORS3.playerEmissiveSpinEffectFace;
		} else {
			spinEffectMaterial.emissiveColor = COLORS3.playerEmissiveNormalFace;
		}
		spinEffect.parent = player;

		player.position.x = position.x;
		player.position.y = position.y;
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

	handleKeyDown(event: KeyboardEvent): void {
		if (!this.controls)
			return;
		let changed = false;
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && !this.keyPressed[i]) {
				this.keyPressed[i] = true;
				changed = true;
			}
		}
		if (changed)
			this.socket?.send(JSON.stringify(this.getPressedKeys()));
	}

	handleKeyUp(event: KeyboardEvent): void {
		if (!this.controls)
			return;
		let changed = false;
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && this.keyPressed[i]) {
				this.keyPressed[i] = false;
				changed = true;
			}
		}
		if (changed)
			this.socket?.send(JSON.stringify(this.getPressedKeys()));
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

export { Player };
