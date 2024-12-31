import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import {
    MangledNameExtractorImpl,
    FakeMangledNameExtractor,
} from '@neurodevs/node-mangled-names'
import { DataType, OpenParams } from 'ffi-rs'
import LibxdfAdapter, {
    FfiRsDefineOptions,
    LibxdfBindings,
} from '../adapters/LibxdfAdapter'
import { XdfFile } from '../components/XdfFileLoader'
import SpyLibxdf from '../testDoubles/Libxdf/SpyLibxdf'

export default class LibxdfTest extends AbstractSpruceTest {
    private static instance: SpyLibxdf
    private static libxdfPath = generateId()
    private static path = generateId()
    private static shouldThrowWhenLoadingBindings: boolean
    private static mangledLoadXdfName: string
    private static fakeBindings: LibxdfBindings
    private static ffiRsOpenOptions?: OpenParams
    private static ffiRsDefineOptions?: FfiRsDefineOptions
    private static loadXdfCalls: string[][] = []

    protected static async beforeEach() {
        await super.beforeEach()

        LibxdfAdapter.Class = SpyLibxdf

        MangledNameExtractorImpl.Class = FakeMangledNameExtractor
        FakeMangledNameExtractor.clearTestDouble()

        this.shouldThrowWhenLoadingBindings = false
        this.mangledLoadXdfName = this.generateMangledName()
        this.fakeBindings = this.FakeBindings()

        this.setFakeExtractResult()
        this.clearAndFakeFfi()

        this.instance = await this.LibxdfAdapter()
    }

    @test()
    protected static canCreateInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(
            // @ts-ignore
            async () => await LibxdfAdapter.Create()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['libxdfPath'],
        })
    }

    @test()
    protected static async throwsWhenBindingsFailToLoad() {
        this.shouldThrowWhenLoadingBindings = true
        const err = await assert.doesThrowAsync(
            async () => await this.LibxdfAdapter()
        )

        errorAssert.assertError(err, 'FAILED_TO_LOAD_LIBXDF', {
            libxdfPath: this.libxdfPath,
        })
    }

    @test()
    protected static async callsFfiRsOpenWithRequiredOptions() {
        assert.isEqualDeep(this.ffiRsOpenOptions, {
            library: 'xdf',
            path: this.libxdfPath,
        })
    }

    @test()
    protected static async callsFfiRsDefineWithRequiredOptions() {
        const mangledLoadXdfName = generateId()
        this.setFakeExtractResult(mangledLoadXdfName)

        await this.LibxdfAdapter()

        assert.isEqualDeep(
            this.ffiRsDefineOptions,
            {
                [mangledLoadXdfName.slice(1)]: {
                    library: 'xdf',
                    retType: DataType.String,
                    paramsType: [DataType.String],
                },
            },
            'Please pass valid options to ffiRsDefine!'
        )
    }

    @test()
    protected static async loadXdfCallsBindings() {
        this.loadXdf()

        assert.isEqualDeep(
            this.loadXdfCalls[0],
            [this.path],
            'Should have called load_xdf_to_json(path)!'
        )
    }

    @test()
    protected static async createsMangledNameExtractor() {
        assert.isEqual(FakeMangledNameExtractor.numConstructorCalls, 1)
    }

    @test()
    protected static async callsExtractorWithCorrectParams() {
        assert.isEqualDeep(FakeMangledNameExtractor.extractCalls[0], {
            libPath: this.libxdfPath,
            unmangledNames: [this.loadXdfName],
        })
    }

    @test()
    protected static async returnsResultInJson() {
        const result = this.loadXdf()
        assert.isEqualDeep(result, this.fakeParsedXdf)
    }

    @test()
    protected static async throwsIfLibxdfPathDoesNotExist() {
        const libxdfPath = generateId()

        const err = await assert.doesThrowAsync(
            async () => await this.LibxdfAdapter(libxdfPath, true)
        )

        errorAssert.assertError(err, 'FAILED_TO_LOAD_LIBXDF', {
            libxdfPath,
        })
    }

    @test()
    protected static async doesNotThrowIfEventsUndefined() {
        this.fakeSerializedXdf = `{"streams": [{"stream_id": ${this.fakeStreamId}, "time_series": [], "time_stamps": [], "stream_info": {"channel_count": ${this.fakeChannelCount}, "channel_format": "${this.fakeChannelFormat}", "nominal_srate": ${this.fakeNominalSampleRate}, "stream_name": "${this.fakeStreamName}", "stream_type": "${this.fakeStreamType}"}}]}`
        this.loadXdf()
    }

    private static setFakeExtractResult(
        mangledLoadXdfName = this.mangledLoadXdfName
    ) {
        FakeMangledNameExtractor.fakeResult = {
            load_xdf_to_json: mangledLoadXdfName,
        }
    }

    private static generateMangledName() {
        return `${generateId()}${this.loadXdfName}${generateId()}`
    }

    private static clearAndFakeFfi() {
        delete this.ffiRsOpenOptions
        delete this.ffiRsDefineOptions
        this.fakeFfiRsOpen()
        this.fakeFfiRsDefine()
    }

    private static fakeFfiRsOpen() {
        LibxdfAdapter.ffiRsOpen = (options) => {
            this.ffiRsOpenOptions = options
        }
    }

    private static fakeFfiRsDefine() {
        LibxdfAdapter.ffiRsDefine = (options) => {
            this.ffiRsDefineOptions = options

            if (this.shouldThrowWhenLoadingBindings) {
                throw new Error('Fake fail to create bindings!')
            }

            return this.fakeBindings as any
        }
    }

    private static loadXdf() {
        return this.instance.loadXdf(this.path)
    }

    private static readonly loadXdfName = 'load_xdf_to_json'

    private static readonly fakeStreamId = 0
    private static readonly fakeStreamName = generateId()
    private static readonly fakeStreamType = generateId()
    private static readonly fakeChannelCount = 0
    private static readonly fakeChannelFormat = generateId()
    private static readonly fakeNominalSampleRate = 0
    private static readonly fakeEventName = generateId()
    private static readonly fakeEventTimestamp = 0

    private static fakeSerializedXdf = `{"streams": [{"stream_id": ${this.fakeStreamId}, "time_series": [], "time_stamps": [], "stream_info": {"channel_count": ${this.fakeChannelCount}, "channel_format": "${this.fakeChannelFormat}", "nominal_srate": ${this.fakeNominalSampleRate}, "stream_name": "${this.fakeStreamName}", "stream_type": "${this.fakeStreamType}"}}], "events": [{"stream_id": ${this.fakeStreamId}, "event_name": "${this.fakeEventName}", "event_timestamp": ${this.fakeEventTimestamp}}]}`

    private static readonly fakeParsedXdf: XdfFile = {
        path: this.path,
        streams: [
            {
                id: this.fakeStreamId,
                name: this.fakeStreamName,
                type: this.fakeStreamType,
                channelCount: this.fakeChannelCount,
                channelFormat: this.fakeChannelFormat,
                nominalSampleRateHz: this.fakeNominalSampleRate,
                data: [],
                timestamps: [],
            },
        ],
        events: [
            {
                name: this.fakeEventName,
                timestamp: this.fakeEventTimestamp,
                streamId: this.fakeStreamId,
            },
        ],
    }

    private static FakeBindings(mangledLoadXdfName = this.mangledLoadXdfName) {
        return {
            [mangledLoadXdfName.slice(1)]: (path: string[]) => {
                this.loadXdfCalls.push(path)
                return this.fakeSerializedXdf
            },
        }
    }

    private static async LibxdfAdapter(
        libxdfPath?: string,
        throwIfPathNotExists = false
    ) {
        const libxdf = await LibxdfAdapter.Create(
            libxdfPath ?? this.libxdfPath,
            throwIfPathNotExists
        )
        return libxdf as SpyLibxdf
    }
}
