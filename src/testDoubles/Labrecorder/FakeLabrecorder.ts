import { Labrecorder } from '../../components/LabrecorderAdapter'

export default class FakeLabrecorder implements Labrecorder {
    public static constructorCalls: string[] = []
    public static createRecordingCalls: any[] = []

    public constructor(labrecorderPath: string) {
        this.constructorCalls.push(labrecorderPath)
    }

    public createRecording(filename: string, watchFor: string[]) {
        this.createRecordingCalls.push({ filename, watchFor })
    }

    private get constructorCalls() {
        return FakeLabrecorder.constructorCalls
    }

    private get createRecordingCalls() {
        return FakeLabrecorder.createRecordingCalls
    }

    public static resetTestDouble() {
        this.constructorCalls = []
        this.createRecordingCalls = []
    }
}
