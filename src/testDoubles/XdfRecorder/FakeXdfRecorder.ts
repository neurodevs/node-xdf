import { mkdir } from 'fs/promises'
import { fakeMkdir, resetCallsToMkdir } from '@neurodevs/fake-node-core'

import XdfStreamRecorder, {
    XdfRecorder,
    XdfRecorderOptions,
} from '../../impl/XdfStreamRecorder.js'

export default class FakeXdfRecorder implements XdfRecorder {
    public static callsToConstructor: (XdfRecorderOptions | undefined)[] = []
    public static numCallsToStart = 0
    public static numCallsToStop = 0

    public constructor(options?: XdfRecorderOptions) {
        this.callsToConstructor.push(options)
    }

    public start() {
        FakeXdfRecorder.numCallsToStart++
        this.isRunning = true
    }

    public stop() {
        FakeXdfRecorder.numCallsToStop++
        this.isRunning = false
    }

    public isRunning = false

    private get callsToConstructor() {
        return FakeXdfRecorder.callsToConstructor
    }

    public static resetTestDouble() {
        FakeXdfRecorder.callsToConstructor = []
        FakeXdfRecorder.numCallsToStart = 0
        FakeXdfRecorder.numCallsToStop = 0

        XdfStreamRecorder.mkdir = fakeMkdir as typeof mkdir
        resetCallsToMkdir()
    }
}
