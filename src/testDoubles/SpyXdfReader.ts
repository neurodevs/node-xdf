import { Libxdf } from '../components/Libxdf'
import XdfReaderImpl, { XdfReaderLoadOptions } from '../components/XdfReader'

export default class SpyXdfReader extends XdfReaderImpl {
    public loadCalls: SpyLoadCall[] = []

    public constructor(libxdf: Libxdf) {
        super(libxdf)
    }

    public async load(filePath: string, options?: XdfReaderLoadOptions) {
        this.loadCalls.push({ filePath, options })
        return await super.load(filePath, options)
    }
}

export interface SpyLoadCall {
    filePath: string
    options?: XdfReaderLoadOptions
}
