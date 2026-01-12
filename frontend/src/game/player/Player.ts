import * as babylon from "@babylonjs/core";
import { PointSettings, PlayerKeys, PlayerSettings } from "../settings/PointSettings.js";
import { PLAYER_DIMENSION, COLORS3, PLAYER_TRAIL_INTERVAL, PLAYER_TRAIL_ON } from "../settings/values.js";
import { PlayerTrail } from "./PlayerTrail.js";
import { EmoteMessage, EmoteChoice, PlanePosition, PlayerControls, Rotation } from "#shared/types_transfert.js";
import { Emote } from "./Emote.js";
import { StunAnimation } from "./StunAnimation.js";

class Player {
	private readonly player: babylon.TransformNode;
	private readonly id: 1 | 2;
	private readonly socket: WebSocket | null = null;
	private readonly controls: PlayerKeys | null = null;
	private trailTimer = 0;
	private readonly keyPressed: Record<string, boolean> = {};
	private readonly applyingSpin;
	private readonly playerTrails: PlayerTrail[] = [];
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;
	private emote: Emote | null = null;
	private stunAnimation: StunAnimation | null = null;

	constructor(scene: babylon.Scene, position: babylon.Vector2, pointSettings: PointSettings, settings: PlayerSettings) {
		this.applyingSpin = pointSettings.spin;
		this.id = settings.playerId;
		this.player = this.setPlayer(scene, position);

		if (PLAYER_TRAIL_ON) {
			this.sceneObservable = scene.onBeforeRenderObservable;
			this.sceneObserver = this.observeScene(scene);
		}

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

		if (settings.socket && settings.playerKeys) {
			this.controls = settings.playerKeys;
			this.socket = settings.socket;
			window.addEventListener("keydown", this.handleKeyDown);
			window.addEventListener("keyup", this.handleKeyUp);
		}
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> | null {
		if (!this.sceneObservable)
			return null;
		const sceneObserver = this.sceneObservable?.add(() => {
			this.trailTimer++;
			if (this.trailTimer < PLAYER_TRAIL_INTERVAL)
				return ;
			this.playerTrails.push(new PlayerTrail(scene, this.player));
			while (this.playerTrails.length && this.playerTrails[0].hasDisappeared()) {
				this.playerTrails.splice(0, 1);
			}
			this.trailTimer = 0;
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

	setStunAnim(playerStunned: boolean, texture: babylon.Texture): void {
		if (!playerStunned) {
			this.stunAnimation?.destroy();
			this.stunAnimation = null;
			return ;
		}
		if (!this.stunAnimation)
			this.stunAnimation = new StunAnimation(this.player.getScene(), texture, this.player);
	}

	getPressedKeys(): PlayerControls {
		const controls: PlayerControls = {
			mov_right: this.keyPressed.mov_right,
			mov_left: this.keyPressed.mov_left,
			rot_right: this.keyPressed.rot_right,
			rot_left: this.keyPressed.rot_left,
			normalMode: this.keyPressed.normalMode,
			spinMode: this.keyPressed.spinMode,
			emoteStrong: this.keyPressed.emoteStrong,
			emoteSad: this.keyPressed.emoteSad,
			emoteLol: this.keyPressed.emoteLol,
			emoteAngry: this.keyPressed.emoteAngry,
			dash: this.keyPressed.dash
		};
		return controls;
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		if (!this.controls)
			return;
		let changed = false;
		event.preventDefault();
		for (const [keyName, keyCode] of Object.entries(this.controls)) {
			if (event.code === keyCode && !this.keyPressed[keyName]) {
				this.keyPressed[keyName] = true;
				changed = true;
			}
		}
		if (changed)
			this.socket?.send(JSON.stringify(this.getPressedKeys()));
	};

	private handleKeyUp = (event: KeyboardEvent): void => {
		if (!this.controls)
			return;
		let changed = false;
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (const [keyName, keyCode] of Object.entries(this.controls)) {
			if (event.code === keyCode && this.keyPressed[keyName]) {
				this.keyPressed[keyName] = false;
				changed = true;
			}
		}
		if (changed)
			this.socket?.send(JSON.stringify(this.getPressedKeys()));
	};

	popEmote(scene: babylon.Scene, message: EmoteMessage, textures: Record<string, babylon.Texture>): void {
		this.emote?.destroy();
		let texture: babylon.Texture;
		switch (message.type) {
			case (EmoteChoice.STRONG):
				texture = textures.emoteStrong;
				break;
			case (EmoteChoice.SAD):
				texture = textures.emoteSad;
				break;
			case (EmoteChoice.LOL):
				texture = textures.emoteLol;
				break;
			default:
				texture = textures.emoteAngry;
				break;
		}
		this.emote = new Emote(scene, texture, this.player);
	}

	clearListeners(): void {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	}

	destroy(): void {
		this.clearListeners();
		this.stunAnimation?.destroy();
		this.emote?.destroy();
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
