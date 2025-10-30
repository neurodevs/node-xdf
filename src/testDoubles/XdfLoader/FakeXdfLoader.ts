import {
    XdfFile,
    XdfLoader,
    XdfLoaderLoadOptions,
} from '../../impl/XdfFileLoader.js'

export default class FakeXdfLoader implements XdfLoader {
    public static numConstructorCalls = 0
    public static callsToLoad: FakeLoadCall[] = []
    public static fakeResponse: XdfFile = { path: '', streams: [], events: [] }

    public constructor() {
        FakeXdfLoader.numConstructorCalls++
    }

    public async load(filePath: string, options?: XdfLoaderLoadOptions) {
        this.callsToLoad.push({ filePath, options })
        return this.fakeResponse
    }

    private get callsToLoad() {
        return FakeXdfLoader.callsToLoad
    }

    private get fakeResponse() {
        return FakeXdfLoader.fakeResponse
    }

    public static resetTestDouble() {
        FakeXdfLoader.numConstructorCalls = 0
        FakeXdfLoader.callsToLoad = []
        FakeXdfLoader.fakeResponse = {} as XdfFile
    }
}

export interface FakeLoadCall {
    filePath: string
    options?: XdfLoaderLoadOptions
}
