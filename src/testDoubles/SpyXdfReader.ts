import XdfReaderImpl, { XdfReaderLoadOptions } from '../XdfReader'

export default class SpyXdfReader extends XdfReaderImpl {
	public loadCalls: SpyLoadCall[] = []

	public constructor() {
		super()
	}

	public async load(filePath: string, options?: XdfReaderLoadOptions) {
		this.loadCalls.push({ filePath, options })
		await super.load(filePath, options)
	}
}

export type SpyLoadCall = {
	filePath: string
	options?: XdfReaderLoadOptions
}
