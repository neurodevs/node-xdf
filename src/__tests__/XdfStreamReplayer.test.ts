import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import { FakeLslOutlet, LslOutletImpl } from '@neurodevs/node-lsl'
import XdfFileLoader, { XdfStream } from '../components/XdfFileLoader'
import XdfStreamReplayer, { XdfReplayer } from '../components/XdfStreamReplayer'
import FakeXdfLoader from '../testDoubles/XdfLoader/FakeXdfLoader'

export default class XdfStreamReplayerTest extends AbstractSpruceTest {
    private static instance: XdfReplayer

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeXdfLoader()
        this.fakeLslOutlet()

        this.instance = await this.XdfStreamReplayer()
    }

    @test()
    protected static async canCreateXdfStreamReplayer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async createThrowsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(async () => {
            // @ts-ignore
            await XdfStreamReplayer.Create()
        })
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['filePath'],
        })
    }

    @test()
    protected static async createsXdfFileLoader() {
        assert.isEqual(
            FakeXdfLoader.numConstructorCalls,
            1,
            'Should create an XdfFileLoader!'
        )
    }

    @test()
    protected static async callsLoadWithFilePath() {
        assert.isEqual(
            FakeXdfLoader.callsToLoad[0]?.filePath,
            this.filePath,
            'Should call load with the file path!'
        )
    }

    @test()
    protected static async createsLslOutletForEachStream() {
        await this.replay()

        assert.isEqual(
            FakeLslOutlet.callsToConstructor.length,
            this.fakeStreams.length,
            'Should create an LSL outlet for each stream!'
        )
    }

    @test()
    protected static async createsLslOutletsWithCorrectOptions() {
        await this.replay()

        this.fakeStreams.forEach((stream, i) => {
            const expected = {
                type: stream.type,
                name: stream.type,
                sourceId: stream.type,
                sampleRate: stream.nominalSampleRateHz,
                channelNames: Array.from(
                    { length: stream.channelCount },
                    (_, i) => `${stream.type}_channel_${i}`
                ),
                channelFormat: 'float32',
                chunkSize: 1,
                maxBuffered: 0,
            }

            const actual = FakeLslOutlet.callsToConstructor[i].options

            assert.doesInclude(
                actual,
                expected,
                'Should create LSL outlets with correct options!'
            )
        })
    }

    @test()
    protected static async callsPushSampleCorrectTotalTimes() {
        await this.replay()

        assert.isEqual(
            FakeLslOutlet.callsToPushSample.length,
            this.numStreams * this.numSamplesPerChannel,
            'Should call pushSample the correct number of times!'
        )
    }

    @test()
    protected static async waitsBetweenSamplesAtNominalSampleRate() {
        const startMs = Date.now()
        await this.replay()
        const endMs = Date.now()

        const expectedMs = this.msBetweenSamples * this.numSamplesPerChannel
        const actualMs = endMs - startMs

        assert.isAbove(
            actualMs,
            expectedMs,
            'Should wait between samples at nominal sample rate!'
        )
    }

    @test()
    protected static async exitsEarlyWithOptionalArg() {
        const replayForMs = 10

        const startMs = Date.now()
        await this.replay(replayForMs)
        const endMs = Date.now()

        assert.isBetween(
            endMs - startMs,
            0.7 * replayForMs,
            1.3 * replayForMs,
            'Should exit early with optional argument!'
        )
    }

    private static async replay(forMs?: number) {
        await this.instance.replay(forMs)
    }

    private static generateFakeStreams(numStreams = this.numStreams) {
        return Array.from({ length: numStreams }, () =>
            this.generateFakeStream()
        )
    }

    private static generateFakeStream() {
        return {
            type: this.streamType,
            nominalSampleRateHz: this.nominalSampleRateHz,
            data: this.generateRandomData(),
        } as XdfStream
    }

    private static generateRandomData(numChannels = this.numChannelsPerStream) {
        return Array.from({ length: numChannels }, () =>
            this.generateRandomChannelData()
        )
    }

    private static generateRandomChannelData(
        numSamplesPerChannel = this.numSamplesPerChannel
    ) {
        return Array.from({ length: numSamplesPerChannel }, () => Math.random())
    }

    private static fakeXdfLoader() {
        XdfFileLoader.Class = FakeXdfLoader
        FakeXdfLoader.resetTestDouble()

        FakeXdfLoader.fakeResponse = {
            path: this.filePath,
            streams: this.fakeStreams,
            events: [],
        }
    }

    private static fakeLslOutlet() {
        LslOutletImpl.Class = FakeLslOutlet
        FakeLslOutlet.resetTestDouble()
    }

    private static readonly filePath = generateId()
    private static readonly streamType = generateId()
    private static readonly numStreams = 2
    private static readonly numChannelsPerStream = 3
    private static readonly numSamplesPerChannel = 4
    private static readonly nominalSampleRateHz = 200
    private static readonly msBetweenSamples = 1000 / this.nominalSampleRateHz
    private static readonly fakeStreams = this.generateFakeStreams()

    private static async XdfStreamReplayer(filePath = this.filePath) {
        return XdfStreamReplayer.Create(filePath)
    }
}
