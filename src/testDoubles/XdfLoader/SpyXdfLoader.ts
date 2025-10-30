import { Libxdf } from '../../impl/LibxdfAdapter.js'
import XdfFileLoader, {
    XdfLoaderLoadOptions,
} from '../../impl/XdfFileLoader.js'

export default class SpyXdfLoader extends XdfFileLoader {
    public loadCalls: SpyLoadCall[] = []

    public constructor(libxdf: Libxdf) {
        super(libxdf)
    }

    public async load(filePath: string, options?: XdfLoaderLoadOptions) {
        this.loadCalls.push({ filePath, options })
        return await super.load(filePath, options)
    }
}

export interface SpyLoadCall {
    filePath: string
    options?: XdfLoaderLoadOptions
}
