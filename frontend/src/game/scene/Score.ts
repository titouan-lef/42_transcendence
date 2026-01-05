import * as babylon from "@babylonjs/core";
import { SCORE_CANVAS_SIZE, COLORS3, CAMERA_POS_X, MAP_SIZE, SCORE_POS_Y, SCORE_SIZE } from "../settings/values.js";

class Score { 
	private readonly score: babylon.Mesh;
	private readonly scoreTexture: babylon.DynamicTexture;

	constructor(scene: babylon.Scene, camera: babylon.ArcRotateCamera, local: boolean) {
		this.scoreTexture = new babylon.DynamicTexture("scoreTexture", { width: SCORE_CANVAS_SIZE.x, height: SCORE_CANVAS_SIZE.y }, scene, false);
		this.score = babylon.MeshBuilder.CreatePlane("scorePlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.score.billboardMode = 7;
		this.score.material = this.setMaterial(scene, this.scoreTexture);
		this.placeScore(camera, local);
		this.changeScore([0, 0]);
	}
	
	private setMaterial(scene: babylon.Scene, texture: babylon.DynamicTexture): babylon.StandardMaterial {
		const material = new babylon.StandardMaterial("textMat", scene);
		material.diffuseTexture = texture;
		material.emissiveColor = COLORS3.white;
		material.diffuseTexture.hasAlpha = true;
		material.alpha = 1;
		return material;
	}

	private placeScore(camera: babylon.ArcRotateCamera, local: boolean): void {
		let position: babylon.Vector3;
		if (local) {
			position = new babylon.Vector3(0, 0, -MAP_SIZE.z / 2 * 1.5);
		} else {
			const direction = camera.target.subtract(camera.position);
			direction.y = 0;
			direction.normalize();
			const planePosition = camera.position.add(direction.scale(CAMERA_POS_X + (MAP_SIZE.x * 0.6)));
			position = new babylon.Vector3(planePosition.x, SCORE_POS_Y, planePosition.z);
		}
		this.score.position = position;
	}

	changeScore(newText: number[]): void {
		const texture = this.scoreTexture;
		const ctx = texture.getContext();
		ctx.font = `bold ${SCORE_SIZE}px Arial`;
		const text = `${newText[0]} : ${newText[1]}`;
		const textWidth = ctx.measureText(text).width;
		const x = (SCORE_CANVAS_SIZE.x - textWidth) / 2;
		const y = SCORE_CANVAS_SIZE.y / 2 + SCORE_SIZE / 2;
		texture.clear();
		texture.drawText(text, x, y, `bold ${SCORE_SIZE}px Arial`, "white", "transparent");
		texture.update();
	}

	destroy(): void {
		this.scoreTexture?.dispose();
		this.score?.material?.dispose();
		this.score?.dispose();
	}
}

export { Score };
