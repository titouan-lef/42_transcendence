import * as babylon from "@babylonjs/core";
import { COLORS3, MAP_SIZE, COUNTDOWN_SIZE, COUNTDOWN_CANVAS_SIZE, COUNTDOWN_POS_Y } from "../settings/values.js";

class CountDown { 
	private readonly countDown: babylon.Mesh;
	private readonly countDownTexture: babylon.DynamicTexture;

	constructor(scene: babylon.Scene) {
		this.countDownTexture = new babylon.DynamicTexture("scoreTexture", { width: COUNTDOWN_CANVAS_SIZE.x, height: COUNTDOWN_CANVAS_SIZE.y }, scene, false);
		this.countDown = babylon.MeshBuilder.CreatePlane("scorePlane", { width: MAP_SIZE.z * 0.4, height: MAP_SIZE.z * 0.2 }, scene);
		this.countDown.renderingGroupId = 1;
		this.setMaterial(scene);
		this.countDown.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL;
		this.countDown.position = new babylon.Vector3(0, COUNTDOWN_POS_Y, 0);
	}
	
	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial("scoreMat", scene);
		material.diffuseTexture = this.countDownTexture;
		material.emissiveColor = COLORS3.red;
		material.diffuseTexture.hasAlpha = true;
		material.alpha = 1;
		this.countDown.material = material;
	}

	udpateCountDown(time: number): CountDown | null {
		if (time <= 0) {
			this.destroy();
			return null;
		}
		if (time > 1)
			this.changeText(time - 1);
		else
			this.changeText("GO!");
		return this;
	}

	private changeText(score: string | number): void {
		if (this.countDown.material === null)
			return;
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
		this.countDownTexture?.dispose();
		this.countDown?.material?.dispose();
		this.countDown?.dispose();
	}
}

export { CountDown };