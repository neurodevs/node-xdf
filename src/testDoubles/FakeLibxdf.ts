import { MangledNameMap } from '@neurodevs/node-mangled-names'
import { Libxdf, XdfFile } from '../Libxdf'

export default class FakeLibxdf implements Libxdf {
	public static libxdfPath?: string
	public static loadXdfCalls: string[] = []
	public static mangledNameMap: MangledNameMap

	public constructor(libxdfPath: string, mangledNameMap: MangledNameMap) {
		FakeLibxdf.libxdfPath = libxdfPath
		FakeLibxdf.mangledNameMap = mangledNameMap
	}

	public loadXdf(path: string) {
		FakeLibxdf.loadXdfCalls.push(path)
		return {} as XdfFile
	}

	public get mangledNameMap() {
		return FakeLibxdf.mangledNameMap
	}

	public static resetTestDouble() {
		FakeLibxdf.libxdfPath = undefined
		FakeLibxdf.loadXdfCalls = []
	}
}
