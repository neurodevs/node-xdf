import LibxdfImpl from '../Libxdf'

export default class SpyLibxdf extends LibxdfImpl {
	public constructor(libxdfPath: string) {
		super(libxdfPath)
	}

	public getBindings() {
		return this.bindings
	}
}
