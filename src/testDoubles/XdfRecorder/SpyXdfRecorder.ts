import XdfStreamRecorder, {
    XdfRecorderOptions,
} from '../../impl/XdfStreamRecorder.js'

export default class SpyXdfRecorder extends XdfStreamRecorder {
    public constructor(options: XdfRecorderOptions) {
        super(options)
    }

    public getRecording() {
        return this.recording
    }
}
