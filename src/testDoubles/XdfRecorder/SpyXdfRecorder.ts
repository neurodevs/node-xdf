import { RecordingHandle } from '@neurodevs/ndx-native'
import XdfStreamRecorder, {
    XdfRecorderConstructorOptions,
} from '../../impl/XdfStreamRecorder.js'

export default class SpyXdfRecorder extends XdfStreamRecorder {
    public constructor(options: XdfRecorderConstructorOptions) {
        super(options)
    }

    public getRecordingHandle(): RecordingHandle | undefined {
        return this.handle
    }
}
