import { XdfFile } from '../Libxdf'
import { XdfReader, XdfReaderLoadOptions } from '../XdfReader'

export default class FakeXdfReader implements XdfReader {
	public static numCallsToConstructor = 0
	public static callsToLoad: FakeLoadCall[] = []
	public static fakeResponse: XdfFile = {} as XdfFile

	public constructor() {
		FakeXdfReader.numCallsToConstructor++
	}

	public async load(filePath: string, options?: XdfReaderLoadOptions) {
		this.callsToLoad.push({ filePath, options })
		return this.fakeResponse
	}

	private get callsToLoad() {
		return FakeXdfReader.callsToLoad
	}

	private get fakeResponse() {
		return FakeXdfReader.fakeResponse
	}

	public static resetTestDouble() {
		FakeXdfReader.callsToLoad = []
		FakeXdfReader.fakeResponse = {} as XdfFile
	}
}

export interface FakeLoadCall {
	filePath: string
	options?: XdfReaderLoadOptions
}
