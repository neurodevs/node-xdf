import os from 'os'
import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import LabrecorderAdapter from '../adapters/LabrecorderAdapter'
import XdfStreamRecorder from '../components/XdfStreamRecorder'
import FakeLabrecorder from '../testDoubles/Labrecorder/FakeLabrecorder'
import SpyXdfRecorder from '../testDoubles/XdfRecorder/SpyXdfRecorder'

export default class XdfStreamRecorderTest extends AbstractSpruceTest {
    private static instance: SpyXdfRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeLabrecorder()
        this.setSpyXdfRecorder()

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
            parameters: ['xdfRecordPath', 'streamQueries'],
        })
    }

    @test()
    protected static async throwsIfRecordPathDoesNotEndInXdf() {
        const invalidPath = generateId()

        const err = await assert.doesThrowAsync(() =>
            XdfStreamRecorder.Create(invalidPath, [])
        )

        errorAssert.assertError(err, 'INVALID_FILE_EXTENSION', {
            xdfRecordPath: invalidPath,
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

        const { filename, watchFor } = FakeLabrecorder.createRecordingCalls[0]

        assert.isEqual(
            filename,
            this.xdfRecordPath,
            'Should have passed filename!'
        )

        this.streamQueries.forEach((query: string) => {
            const isQueryIncluded = watchFor.some((actual: string) => {
                return actual.includes(query)
            })

            assert.isTrue(
                isQueryIncluded,
                `Stream query "${query}" should have matched one of the watchFor queries!`
            )
        })
    }

    @test()
    protected static async callingStartSetsRecording() {
        this.startRecorder()

        const recording = this.instance.getRecording()

        assert.isTruthy(recording, 'Should have set recording!\n')
    }

    @test()
    protected static async callingStopCallsDeleteRecording() {
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

    @test()
    protected static async automaticallyPassesHostnameInWatchFor() {
        this.startRecorder()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        const hostname = `hostname="${this.hostname}"`

        watchFor.forEach((query: string) => {
            assert.doesInclude(query, hostname, 'Should have passed hostname!')
        })
    }

    private static startRecorder() {
        this.instance.start()
    }

    private static stopRecorder() {
        this.instance.stop()
    }

    private static setFakeLabrecorder() {
        LabrecorderAdapter.Class = FakeLabrecorder
        FakeLabrecorder.resetTestDouble()
    }

    private static setSpyXdfRecorder() {
        XdfStreamRecorder.Class = SpyXdfRecorder
    }

    private static readonly xdfRecordPath = `${generateId()}.xdf`
    private static readonly hostname = os.hostname()

    private static readonly streamQueries = [generateId(), generateId()]

    private static XdfStreamRecorder() {
        return XdfStreamRecorder.Create(
            this.xdfRecordPath,
            this.streamQueries
        ) as SpyXdfRecorder
    }
}
