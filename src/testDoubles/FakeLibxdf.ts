import { Libxdf } from '../Libxdf'

export default class FakeLibxdf implements Libxdf {
	public static libxdfPath: string

	public constructor(libxdfPath: string) {
		FakeLibxdf.libxdfPath = libxdfPath
	}
}
