import os from 'os'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import LabrecorderAdapter from '../../modules/LabrecorderAdapter'
import XdfStreamRecorder from '../../modules/XdfStreamRecorder'
import FakeLabrecorder from '../../testDoubles/Labrecorder/FakeLabrecorder'
import SpyXdfRecorder from '../../testDoubles/XdfRecorder/SpyXdfRecorder'
import AbstractPackageTest from '../AbstractPackageTest'

export default class XdfStreamRecorderTest extends AbstractPackageTest {
    private static instance: SpyXdfRecorder
    private static concrete: XdfStreamRecorder
    private static passedDir: string
    private static passedOptions: any

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeLabrecorder()
        this.setSpyXdfRecorder()

        this.setFakeMkdir()

        this.instance = this.XdfStreamRecorder()
    }

    @test()
    protected static async canCreateXdfStreamRecorder() {
        assert.isTruthy(this.instance, 'Should have created an instance!')
    }

    @test()
    protected static async throwsIfRecordPathDoesNotEndInXdf() {
        const invalidPath = generateId()

        const err = await assert.doesThrowAsync(() =>
            XdfStreamRecorder.Create(invalidPath, [])
        )

        assert.isEqual(
            err.message,
            this.generateErrorMessage(invalidPath),
            'Did not receive the expected error!'
        )
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
        this.startThenStop()

        assert.isEqual(
            FakeLabrecorder.deleteRecordingCalls.length,
            1,
            'Should have called deleteRecording!\n'
        )
    }

    @test()
    protected static async acceptsOptionalHostname() {
        const hostname = generateId()

        const recorder = this.XdfStreamRecorder(hostname)
        recorder.start()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        const expected = `hostname="${hostname}"`

        watchFor.forEach((query: string) => {
            assert.doesInclude(query, expected, 'Should have passed hostname!')
        })
    }

    @test()
    protected static async defaultsToLocalHostnameInWatchFor() {
        this.startRecorder()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        const expected = `hostname="${this.hostname}"`

        watchFor.forEach((query: string) => {
            assert.doesInclude(query, expected, 'Should have passed hostname!')
        })
    }

    @test()
    protected static async isRunningDefaultsToFalse() {
        delete XdfStreamRecorder.Class
        this.concrete = this.XdfStreamRecorder()

        assert.isFalse(this.concrete.isRunning, 'Should not be running!')
    }

    @test()
    protected static async isRunningReturnsTrueAfterStart() {
        this.concrete.start()

        assert.isTrue(this.concrete.isRunning, 'Should be running!')
    }

    @test()
    protected static async isRunningReturnsFalseAfterStop() {
        this.concrete.start()
        this.concrete.stop()

        assert.isFalse(this.concrete.isRunning, 'Should not be running!')
    }

    @test()
    protected static async doesNotCreateRecordingIfAlreadyExists() {
        this.startRecorder()
        this.startRecorder()

        assert.isEqual(
            FakeLabrecorder.createRecordingCalls.length,
            1,
            'Should not have created a new recording!'
        )
    }

    @test()
    protected static async doesNotDeleteRecordingIfDoesNotExist() {
        this.startThenStop()
        this.stopRecorder()

        assert.isEqual(
            FakeLabrecorder.deleteRecordingCalls.length,
            1,
            'Should not have deleted a recording!'
        )
    }

    @test()
    protected static async recursivelyCreatesDirectoriesInXdfRecordPath() {
        this.startRecorder()

        assert.isEqual(
            this.passedDir,
            this.recordDir,
            'Should have passed recordDir!'
        )

        assert.isEqualDeep(
            this.passedOptions,
            { recursive: true },
            'Should have passed recursive equals true!'
        )
    }

    private static startThenStop() {
        this.startRecorder()
        this.stopRecorder()
    }

    private static startRecorder() {
        this.instance.start()
    }

    private static stopRecorder() {
        this.instance.stop()
    }

    private static generateErrorMessage(xdfRecordPath?: string) {
        return `
            \n -----------------------------------
            \n Invalid file extension! 
            \n Must end in ".xdf", not "${xdfRecordPath ?? this.xdfRecordPath}"
            \n -----------------------------------
        `
    }

    private static setFakeLabrecorder() {
        LabrecorderAdapter.Class = FakeLabrecorder
        FakeLabrecorder.resetTestDouble()
    }

    private static setSpyXdfRecorder() {
        XdfStreamRecorder.Class = SpyXdfRecorder
    }

    private static setFakeMkdir() {
        this.passedDir = ''
        this.passedOptions = {}

        // @ts-ignore
        XdfStreamRecorder.mkdir = (dir: string, options: any) => {
            this.passedDir = dir
            this.passedOptions = options
        }
    }

    private static readonly recordDir = generateId()
    private static readonly xdfRecordPath = `${this.recordDir}/${generateId()}.xdf`
    private static readonly hostname = os.hostname()

    private static readonly streamQueries = [generateId(), generateId()]

    private static XdfStreamRecorder(hostname?: string) {
        return XdfStreamRecorder.Create(
            this.xdfRecordPath,
            this.streamQueries,
            { hostname }
        ) as SpyXdfRecorder
    }
}
