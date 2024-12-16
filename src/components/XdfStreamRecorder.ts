import { assertOptions } from '@sprucelabs/schema'
import LabrecorderAdapter from './LabrecorderAdapter'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected constructor() {}

    public static Create(recordingPath: string, streamQueries: any) {
        assertOptions({ recordingPath, streamQueries }, [
            'recordingPath',
            'streamQueries',
        ])

        LabrecorderAdapter.Create()
        return new (this.Class ?? this)()
    }
}

export interface XdfRecorder {}

export type XdfRecorderConstructor = new () => XdfRecorder
