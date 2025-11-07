import * as babylon from "@babylonjs/core";
import { COLORS3, MAP_SIZE, COUNTDOWN_SIZE, COUNTDOWN_CANVAS_SIZE, COUNTDOWN_POS_Y, START_TIMEOUT } from "../settings/values.js";

export class CountDown { 
	private readonly countDown: babylon.Mesh;
	private readonly countDownTexture: babylon.DynamicTexture;
	private readonly intervalOutId: ReturnType<typeof setInterval>;
	private timeOutId: ReturnType<typeof setTimeout> | null = null;

	constructor(scene: babylon.Scene) {
		this.countDownTexture = new babylon.DynamicTexture("scoreTexture", { width: COUNTDOWN_CANVAS_SIZE.x, height: COUNTDOWN_CANVAS_SIZE.y }, scene, false);
		this.countDown = babylon.MeshBuilder.CreatePlane("scorePlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.countDown.renderingGroupId = 2;
		this.setMaterial(scene);
		this.countDown.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL; // so it faces camera
		this.countDown.position = new babylon.Vector3(0, COUNTDOWN_POS_Y, 0);
		let i = 3;
		this.changeText(i);
		this.intervalOutId = setInterval(() => {
			i--;
			if (i !== 0)
				this.changeText(i);
			else {
				this.changeText("GO!");
				this.timeOutId = setTimeout(() => {
					this.destroy();
				}, START_TIMEOUT / 4);
			}
		}, START_TIMEOUT / 4);
	}
	
	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial("scoreMat", scene);
		material.diffuseTexture = this.countDownTexture;
		material.emissiveColor = COLORS3.red;
		material.diffuseTexture.hasAlpha = true;
		material.alpha = 1;
		this.countDown.material = material;
	}

	changeText(score: string | number): void {
		if (this.countDown.material === null)
			return ;
		const ctx = this.countDownTexture.getContext();
		ctx.font = `bold ${COUNTDOWN_SIZE}px Arial`;
		const text = `${score}`;
		const textWidth = ctx.measureText(text).width;
		const x = (COUNTDOWN_CANVAS_SIZE.x - textWidth) / 2;
		const y = COUNTDOWN_CANVAS_SIZE.y / 2 + COUNTDOWN_SIZE / 2;
		this.countDownTexture.clear();
		this.countDownTexture.drawText(text, x, y, `bold ${COUNTDOWN_SIZE}px Arial`, "red", null);
		this.countDownTexture.update();
	}

	destroy(): void {
		if (this.timeOutId)
			clearTimeout(this.timeOutId);
		clearTimeout(this.intervalOutId);
		this.countDownTexture?.dispose();
		this.countDown?.material?.dispose();
		this.countDown?.dispose();
	}
}