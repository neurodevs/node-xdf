import XdfStreamRecorder, {
    XdfRecorderOptions,
} from '../../impl/XdfStreamRecorder.js'

export default class SpyXdfRecorder extends XdfStreamRecorder {
    public constructor(options: Required<XdfRecorderOptions>) {
        super(options)
    }

    public getRecording() {
        return this.recording
    }
}
