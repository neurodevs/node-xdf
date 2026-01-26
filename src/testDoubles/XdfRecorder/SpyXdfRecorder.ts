import XdfStreamRecorder, {
    XdfRecorderConstructorOptions,
} from '../../impl/XdfStreamRecorder.js'

export default class SpyXdfRecorder extends XdfStreamRecorder {
    public constructor(options: XdfRecorderConstructorOptions) {
        super(options)
    }

    public getRecording() {
        return this.recording
    }
}
