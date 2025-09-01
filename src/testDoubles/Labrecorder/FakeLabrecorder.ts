import { BoundRecording, Labrecorder } from '../../modules/LabrecorderAdapter'

export default class FakeLabrecorder implements Labrecorder {
    public static constructorCalls: string[] = []
    public static createRecordingCalls: any[] = []
    public static stopRecordingCalls: any[] = []
    public static deleteRecordingCalls: any[] = []

    public constructor(labrecorderPath: string) {
        this.constructorCalls.push(labrecorderPath)
    }

    public createRecording(filename: string, watchFor: string[]) {
        this.createRecordingCalls.push({ filename, watchFor })
        return {} as BoundRecording
    }

    public stopRecording(recording: BoundRecording) {
        this.stopRecordingCalls.push({ recording })
    }

    public deleteRecording(recording: BoundRecording) {
        this.deleteRecordingCalls.push({ recording })
    }

    private get constructorCalls() {
        return FakeLabrecorder.constructorCalls
    }

    private get createRecordingCalls() {
        return FakeLabrecorder.createRecordingCalls
    }

    private get stopRecordingCalls() {
        return FakeLabrecorder.stopRecordingCalls
    }

    private get deleteRecordingCalls() {
        return FakeLabrecorder.deleteRecordingCalls
    }

    public static resetTestDouble() {
        this.constructorCalls = []
        this.createRecordingCalls = []
        this.stopRecordingCalls = []
        this.deleteRecordingCalls = []
    }
}
