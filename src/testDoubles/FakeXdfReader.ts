import { XdfFile, XdfReader, XdfReaderLoadOptions } from '../XdfReader'

export default class FakeXdfReader implements XdfReader {
    public static numConstructorCalls = 0
    public static callsToLoad: FakeLoadCall[] = []
    public static fakeResponse: XdfFile = { path: '', streams: [], events: [] }

    public constructor() {
        FakeXdfReader.numConstructorCalls++
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
        FakeXdfReader.numConstructorCalls = 0
        FakeXdfReader.callsToLoad = []
        FakeXdfReader.fakeResponse = {} as XdfFile
    }
}

export interface FakeLoadCall {
    filePath: string
    options?: XdfReaderLoadOptions
}
