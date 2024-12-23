import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import LabrecorderAdapter from '../components/LabrecorderAdapter'
import XdfStreamRecorder from '../components/XdfStreamRecorder'
import FakeLabrecorder from '../testDoubles/Labrecorder/FakeLabrecorder'
import SpyXdfRecorder from '../testDoubles/XdfRecorder/SpyXdfRecorder'

export default class XdfStreamRecorderTest extends AbstractSpruceTest {
    private static instance: SpyXdfRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        LabrecorderAdapter.Class = FakeLabrecorder
        FakeLabrecorder.resetTestDouble()

        XdfStreamRecorder.Class = SpyXdfRecorder

        this.instance = this.XdfStreamRecorder()
    }

    @test()
    protected static async canCreateXdfStreamRecorder() {
        assert.isTruthy(this.instance, 'Should have created an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(() =>
            // @ts-ignore
            XdfStreamRecorder.Create()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['recordingPath', 'streamQueries'],
        })
    }

    @test()
    protected static async createsLabrecorderAdapterInstance() {
        assert.isEqual(
            FakeLabrecorder.constructorCalls.length,
            1,
            'Should have created an instance of LabrecorderAdapter!'
        )
    }

    @test()
    protected static async callingStartCallsCreateRecording() {
        this.startRecorder()

        assert.isEqualDeep(
            FakeLabrecorder.createRecordingCalls[0],
            {
                filename: this.recordingPath,
                watchFor: this.streamQueries,
            },
            'Should have called createRecording!\n'
        )
    }

    @test()
    protected static async callingStopCallsDeleteRecording() {
        this.startRecorder()
        this.stopRecorder()

        const recording = this.instance.getRecording()

        assert.isEqualDeep(
            FakeLabrecorder.deleteRecordingCalls[0],
            {
                recording,
            },
            'Should have called deleteRecording!\n'
        )
    }

    private static startRecorder() {
        this.instance.start()
    }

    private static stopRecorder() {
        this.instance.stop()
    }

    private static readonly recordingPath = generateId()
    private static readonly streamQueries = [generateId(), generateId()]

    private static XdfStreamRecorder() {
        return XdfStreamRecorder.Create(
            this.recordingPath,
            this.streamQueries
        ) as SpyXdfRecorder
    }
}
