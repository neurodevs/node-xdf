import { Libxdf } from '../../components/LibxdfAdapter'
import XdfFileLoader, {
    XdfLoaderLoadOptions,
} from '../../components/XdfFileLoader'

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
