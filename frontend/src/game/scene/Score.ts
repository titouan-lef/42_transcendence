import * as babylon from "@babylonjs/core";
import { SCORE_CANVAS_SIZE, COLORS3, CAMERA_POS_X, MAP_SIZE, SCORE_POS_Y, SCORE_SIZE } from "../settings/values.js";

export class Score { 
	private readonly score: babylon.Mesh;
	private readonly scoreTexture: babylon.DynamicTexture;

	constructor(scene: babylon.Scene, camera: babylon.ArcRotateCamera) {
		this.scoreTexture = new babylon.DynamicTexture("scoreTexture", { width: SCORE_CANVAS_SIZE.x, height: SCORE_CANVAS_SIZE.y }, scene, false);
		this.score = babylon.MeshBuilder.CreatePlane("scorePlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.setMaterial(scene);
		this.score.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL;
		this.placeScore(camera);
		this.changeScore([0, 0]);
	}
	
	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial("scoreMat", scene);
		material.diffuseTexture = this.scoreTexture;
		material.emissiveColor = COLORS3.white;
		material.diffuseTexture.hasAlpha = true;
		material.alpha = 1;
		this.score.material = material;
	}

	private placeScore(camera: babylon.ArcRotateCamera): void {
		const direction = camera.target.subtract(camera.position);
		direction.y = 0;
		direction.normalize();
		const planePosition = camera.position.add(direction.scale(CAMERA_POS_X + (MAP_SIZE.x * 0.6)));
		this.score.position = new babylon.Vector3(planePosition.x, SCORE_POS_Y, planePosition.z);
	}

	changeScore(score: number[]): void {
		if (this.score.material === null)
			return;
		const ctx = this.scoreTexture.getContext();
		ctx.font = `bold ${SCORE_SIZE}px Arial`;
		const text = `${score[0]} : ${score[1]}`;
		const textWidth = ctx.measureText(text).width;
		const x = (SCORE_CANVAS_SIZE.x - textWidth) / 2;
		const y = SCORE_CANVAS_SIZE.y / 2 + SCORE_SIZE / 2;
		this.scoreTexture.clear();
		this.scoreTexture.drawText(text, x, y, `bold ${SCORE_SIZE}px Arial`, "white", "transparent");
		this.scoreTexture.update();
	}

	destroy(): void {
		this.scoreTexture?.dispose();
		this.score?.material?.dispose();
		this.score?.dispose();
	}
}