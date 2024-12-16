import LabrecorderAdapter from './LabrecorderAdapter'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected constructor() {}

    public static async Create() {
        await LabrecorderAdapter.Create('oiaushdoua')
        return new (this.Class ?? this)()
    }
}

export interface XdfRecorder {}

export type XdfRecorderConstructor = new () => XdfRecorder
