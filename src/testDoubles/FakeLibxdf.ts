import { Libxdf, XdfFile } from '../Libxdf'

export default class FakeLibxdf implements Libxdf {
	public static libxdfPath?: string
	public static loadXdfCalls: string[] = []

	public constructor(libxdfPath: string) {
		FakeLibxdf.libxdfPath = libxdfPath
	}

	public loadXdf(path: string) {
		FakeLibxdf.loadXdfCalls.push(path)
		return {} as XdfFile
	}

	public static resetTestDouble() {
		FakeLibxdf.libxdfPath = undefined
		FakeLibxdf.loadXdfCalls = []
	}
}
