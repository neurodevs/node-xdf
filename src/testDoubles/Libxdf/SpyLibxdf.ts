import { MangledNameMap } from '@neurodevs/node-mangled-names'
import LibxdfAdapter from '../../components/LibxdfAdapter'

export default class SpyLibxdf extends LibxdfAdapter {
    public constructor(libxdfPath: string, mangledNameMap: MangledNameMap) {
        super(libxdfPath, mangledNameMap)
    }

    public getBindings() {
        return this.bindings
    }
}