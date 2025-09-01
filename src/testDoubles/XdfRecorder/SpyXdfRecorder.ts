import XdfStreamRecorder, {
    XdfRecorderOptions,
} from '../../modules/XdfStreamRecorder'

export default class SpyXdfRecorder extends XdfStreamRecorder {
    public constructor(options: XdfRecorderOptions) {
        super(options)
    }

    public getRecording() {
        return this.recording
    }
}
