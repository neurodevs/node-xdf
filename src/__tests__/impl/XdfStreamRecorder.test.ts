import { mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import {
    callsToMkdir,
    fakeMkdir,
    resetCallsToMkdir,
} from '@neurodevs/fake-node-core'
import generateId from '@neurodevs/generate-id'
import { test, assert } from '@neurodevs/node-tdd'

import LabrecorderAdapter from '../../impl/LabrecorderAdapter.js'
import XdfStreamRecorder, {
    CreateRecorderOptions,
} from '../../impl/XdfStreamRecorder.js'
import FakeLabrecorder from '../../testDoubles/Labrecorder/FakeLabrecorder.js'
import SpyXdfRecorder from '../../testDoubles/XdfRecorder/SpyXdfRecorder.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class XdfStreamRecorderTest extends AbstractPackageTest {
    private static instance: SpyXdfRecorder
    private static concrete: XdfStreamRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeLabrecorder()
        this.setSpyXdfRecorder()

        this.setFakeMkdir()

        this.instance = await this.XdfStreamRecorder()
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
        this.start()

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
        this.start()

        const recording = this.instance.getRecording()

        assert.isTruthy(recording, 'Should have set recording!\n')
    }

    @test()
    protected static async callingFinishCallsDeleteRecording() {
        this.startThenFinish()

        assert.isEqual(
            FakeLabrecorder.deleteRecordingCalls.length,
            1,
            'Should have called deleteRecording!\n'
        )
    }

    @test()
    protected static async acceptsOptionalHostname() {
        const hostname = generateId()

        const recorder = await this.XdfStreamRecorder({ hostname })
        recorder.start()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        const expected = `hostname="${hostname}"`

        watchFor.forEach((query: string) => {
            assert.doesInclude(query, expected, 'Should have passed hostname!')
        })
    }

    @test()
    protected static async defaultsToLocalHostnameInWatchFor() {
        this.start()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        const expected = `hostname="${this.hostname}"`

        watchFor.forEach((query: string) => {
            assert.doesInclude(query, expected, 'Should have passed hostname!')
        })
    }

    @test()
    protected static async doesNotAddHostnameIfAlreadyPresent() {
        const streamQueries = [
            `${this.generateId()} and hostname="${this.hostname}"`,
            `${this.generateId()} and hostname="${this.hostname}"`,
        ]

        const recorder = (await XdfStreamRecorder.Create(
            this.xdfRecordPath,
            streamQueries
        )) as SpyXdfRecorder

        recorder.start()

        const { watchFor } = FakeLabrecorder.createRecordingCalls[0]

        streamQueries.forEach((query: string) => {
            assert.isTrue(
                watchFor.includes(query),
                'Should have included original query!'
            )
        })
    }

    @test()
    protected static async isRunningDefaultsToFalse() {
        delete XdfStreamRecorder.Class
        this.concrete = await this.XdfStreamRecorder()

        assert.isFalse(this.concrete.isRunning, 'Should not be running!')
    }

    @test()
    protected static async isRunningReturnsTrueAfterStart() {
        this.concrete.start()

        assert.isTrue(this.concrete.isRunning, 'Should be running!')
    }

    @test()
    protected static async isRunningReturnsFalseAfterFinish() {
        this.concrete.start()
        this.concrete.finish()

        assert.isFalse(this.concrete.isRunning, 'Should not be running!')
    }

    @test()
    protected static async doesNotCreateRecordingIfAlreadyExists() {
        this.start()
        this.start()

        assert.isEqual(
            FakeLabrecorder.createRecordingCalls.length,
            1,
            'Should not have created a new recording!'
        )
    }

    @test()
    protected static async doesNotDeleteRecordingIfDoesNotExist() {
        this.startThenFinish()
        this.finish()

        assert.isEqual(
            FakeLabrecorder.deleteRecordingCalls.length,
            1,
            'Should not have deleted a recording!'
        )
    }

    @test()
    protected static async recursivelyCreatesDirectoriesInXdfRecordPath() {
        this.start()

        assert.isEqualDeep(
            callsToMkdir[0],
            {
                path: this.recordDir,
                options: { recursive: true },
            },
            'Did not call mkdir as expected!'
        )
    }

    @test()
    protected static async doesNotMakeRecordingDirIfPassedFlag() {
        resetCallsToMkdir()

        await this.XdfStreamRecorder({
            shouldMkdir: false,
        })

        assert.isEqual(callsToMkdir.length, 0, 'Should not have called mkdir!')
    }

    private static startThenFinish() {
        this.start()
        this.finish()
    }

    private static start() {
        this.instance.start()
    }

    private static finish() {
        this.instance.finish()
    }

    private static generateErrorMessage(xdfRecordPath?: string) {
        const fileExtension = path.extname(xdfRecordPath ?? this.xdfRecordPath)
        return `Invalid file extension! Must end in .xdf, not ${fileExtension} \n`
    }

    private static setFakeLabrecorder() {
        LabrecorderAdapter.Class = FakeLabrecorder
        FakeLabrecorder.resetTestDouble()
    }

    private static setSpyXdfRecorder() {
        XdfStreamRecorder.Class = SpyXdfRecorder
    }

    private static setFakeMkdir() {
        XdfStreamRecorder.mkdir = fakeMkdir as typeof mkdir
        resetCallsToMkdir()
    }

    private static readonly recordDir = generateId()
    private static readonly xdfRecordPath = `${this.recordDir}/${generateId()}.xdf`
    private static readonly hostname = os.hostname()

    private static readonly streamQueries = [generateId(), generateId()]

    private static async XdfStreamRecorder(
        options?: Partial<CreateRecorderOptions>
    ) {
        const recorder = await XdfStreamRecorder.Create(
            this.xdfRecordPath,
            this.streamQueries,
            options
        )
        return recorder as SpyXdfRecorder
    }
}
