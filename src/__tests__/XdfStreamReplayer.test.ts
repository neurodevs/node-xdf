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

    private static async replay() {
        await this.instance.replay()
    }

    private static readonly filePath = generateId()

    private static readonly fakeStreams = [
        this.generateFakeStream(),
        this.generateFakeStream(),
    ]

    private static fakeXdfLoader() {
        XdfFileLoader.Class = FakeXdfLoader
        FakeXdfLoader.resetTestDouble()
        FakeXdfLoader.fakeResponse = {
            path: this.filePath,
            streams: this.fakeStreams,
            events: [],
        }
    }

    private static generateFakeStream() {
        return {
            type: generateId(),
            nominalSampleRateHz: 100 * Math.random(),
        } as XdfStream
    }

    private static fakeLslOutlet() {
        LslOutletImpl.Class = FakeLslOutlet
        FakeLslOutlet.resetTestDouble()
    }

    private static async XdfStreamReplayer(filePath = this.filePath) {
        return XdfStreamReplayer.Create(filePath)
    }
}
