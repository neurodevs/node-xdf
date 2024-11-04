import { MangledNameMap } from '@neurodevs/node-mangled-names'
import LibxdfImpl from '../Libxdf'

export default class SpyLibxdf extends LibxdfImpl {
    public constructor(libxdfPath: string, mangledNameMap: MangledNameMap) {
        super(libxdfPath, mangledNameMap)
    }

    public getBindings() {
        return this.bindings
    }
}
