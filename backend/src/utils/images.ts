import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";

interface Size {
	width: number;
	height: number;
}

const EXEC = promisify(execFile);

async function getGifDimensions(filePath: string): Promise<Size> {
	const buffer = await fs.promises.readFile(filePath);
	const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	const size: Size = {
		width: view.getUint16(6, true),
		height: view.getUint16(8, true)
	};
	return size;
}

async function resizeGif(inputPath: string, outputPath: string, size: number): Promise<void> {
	const originalSize = await getGifDimensions(inputPath);
	
	const square = Math.min(originalSize.width, originalSize.height);

	const x1 = Math.floor((originalSize.width - square) / 2);
	const y1 = Math.floor((originalSize.height - square) / 2);

	const x2 = x1 + square;
	const y2 = y1 + square;

	await EXEC("gifsicle", [
		"--crop", `${x1},${y1}-${x2},${y2}`,
		"--resize", `${size}x${size}`,
		"-o", outputPath,
		inputPath
	]);
}

export { resizeGif };
