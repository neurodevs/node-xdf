import { Libxdf, XdfFile } from '../Libxdf'

export default class FakeLibxdf implements Libxdf {
	public static libxdfPath: string
	public static path: string

	public constructor(libxdfPath: string) {
		FakeLibxdf.libxdfPath = libxdfPath
	}

	public loadXdf(path: string) {
		FakeLibxdf.path = path
		return {} as XdfFile
	}
}
