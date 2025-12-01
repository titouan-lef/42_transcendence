import * as babylon from "@babylonjs/core";
import { SCORE_CANVAS_SIZE, COLORS3, CAMERA_POS_X, MAP_SIZE, SCORE_POS_Y, SCORE_SIZE } from "../settings/values.js";

class Score { 
	private readonly score: babylon.Mesh;
	private readonly scoreTexture: babylon.DynamicTexture;
	private readonly names: babylon.Mesh;
	private readonly namesTexture: babylon.DynamicTexture;

	constructor(scene: babylon.Scene, camera: babylon.ArcRotateCamera) {
		this.scoreTexture = new babylon.DynamicTexture("scoreTexture", { width: SCORE_CANVAS_SIZE.x, height: SCORE_CANVAS_SIZE.y }, scene, false);
		this.score = babylon.MeshBuilder.CreatePlane("scorePlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.score.billboardMode = 7;
		this.score.material = this.setMaterial(scene, this.scoreTexture);
		this.placeScore(camera);
		this.changeText([0, 0], "score");

		this.namesTexture = new babylon.DynamicTexture("namesTexture", { width: SCORE_CANVAS_SIZE.x, height: SCORE_CANVAS_SIZE.y }, scene, false);
		this.names = babylon.MeshBuilder.CreatePlane("namesPlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.names.billboardMode = 7;
		this.names.material = this.setMaterial(scene, this.namesTexture);
		this.placeNames();
		this.changeText(["Bob", "John"], "names");
	}
	
	private setMaterial(scene: babylon.Scene, texture: babylon.DynamicTexture): babylon.StandardMaterial {
		const material = new babylon.StandardMaterial("textMat", scene);
		material.diffuseTexture = texture;
		material.emissiveColor = COLORS3.white;
		material.diffuseTexture.hasAlpha = true;
		material.alpha = 1;
		return material;
	}

	private placeScore(camera: babylon.ArcRotateCamera): void {
		const direction = camera.target.subtract(camera.position);
		direction.y = 0;
		direction.normalize();
		const planePosition = camera.position.add(direction.scale(CAMERA_POS_X + (MAP_SIZE.x * 0.6)));
		this.score.position = new babylon.Vector3(planePosition.x, SCORE_POS_Y, planePosition.z);
	}

	private placeNames(): void {
		this.names.position = new babylon.Vector3(this.score.position.x, this.score.position.y + SCORE_CANVAS_SIZE.y + 2, this.score.position.z);
	}

	changeText(newText: number[] | string[], type: "score" | "names"): void {
		const texture = type === "score" ? this.scoreTexture : this.namesTexture;
		const ctx = texture.getContext();
		ctx.font = `bold ${SCORE_SIZE}px Arial`;
		let text;
		if (type === "score")
			text = `${newText[0]} : ${newText[1]}`;
		else
			text = `${newText[0]} VS ${newText[1]}`;
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
		this.namesTexture?.dispose();
		this.names?.material?.dispose();
		this.names?.dispose();
	}
}

export { Score };