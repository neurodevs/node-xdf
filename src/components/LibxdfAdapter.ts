import fs from 'fs'
import { assertOptions } from '@sprucelabs/schema'
import {
    MangledNameExtractorImpl,
    MangledNameMap,
} from '@neurodevs/node-mangled-names'
import { DataType, define, FieldType, FuncObj, open } from 'ffi-rs'
import SpruceError from '../errors/SpruceError'
import { XdfFile } from './XdfFileLoader'

export default class LibxdfAdapter implements Libxdf {
    public static Class?: LibxdfConstructor
    public static ffiRsOpen = open
    public static ffiRsDefine = define
    private static readonly loadXdfName = 'load_xdf_to_json'
    private static unmangledNames = [this.loadXdfName]

    protected bindings!: LibxdfBindings
    private libxdfPath: string
    private mangledNameMap: MangledNameMap

    protected constructor(libxdfPath: string, mangledNameMap: MangledNameMap) {
        this.libxdfPath = libxdfPath
        this.mangledNameMap = mangledNameMap

        this.tryToLoadBindings()
    }

    private tryToLoadBindings() {
        try {
            this.bindings = this.loadBindings()
        } catch (err: any) {
            this.throwFailedToLoadLiblsl(err)
        }
    }

    private loadBindings() {
        this.openLibxdf()
        return this.defineBindings()
    }

    private openLibxdf() {
        LibxdfAdapter.ffiRsOpen({
            library: 'xdf',
            path: this.libxdfPath,
        })
    }

    private defineBindings() {
        const funcs = this.unmangledNames.reduce((acc, name) => {
            const mangledName = this.mangledNameMap[name].slice(1)

            // @ts-ignore
            acc[mangledName] = {
                library: 'xdf',
                retType: DataType.String,
                paramsType: [DataType.String],
            }
            return acc
        }, {})

        return LibxdfAdapter.ffiRsDefine(funcs)
    }

    private throwFailedToLoadLiblsl(err: any) {
        throw new SpruceError({
            code: 'FAILED_TO_LOAD_LIBXDF',
            libxdfPath: this.libxdfPath,
            originalError: err,
        })
    }

    public static async Create(
        libxdfPath: string,
        throwIfPathNotExists = true
    ) {
        assertOptions({ libxdfPath }, ['libxdfPath'])

        if (throwIfPathNotExists && !fs.existsSync(libxdfPath)) {
            throw new SpruceError({
                code: 'FAILED_TO_LOAD_LIBXDF',
                libxdfPath,
            })
        }

        const mangledNameMap = await this.loadMangledNameMap(libxdfPath)
        return new (this.Class ?? this)(libxdfPath, mangledNameMap)
    }

    private static async loadMangledNameMap(libxdfPath: string) {
        const extractor = this.MangledNameExtractor()
        return await extractor.extract(libxdfPath, this.unmangledNames)
    }

    public loadXdf(path: string) {
        const mangledName = this.mangledNameMap[this.loadXdfName].slice(1)
        const mangledFunc = this.bindings[mangledName]

        const serializedData = mangledFunc([path])
        const parsedData = JSON.parse(serializedData) as LibxdfFile

        const mappedStreams = parsedData.streams.map((stream) => ({
            id: stream.stream_id,
            name: stream.stream_info.stream_name,
            type: stream.stream_info.stream_type,
            channelCount: stream.stream_info.channel_count,
            channelFormat: stream.stream_info.channel_format,
            nominalSampleRateHz: stream.stream_info.nominal_srate,
            data: stream.time_series,
            timestamps: stream.time_stamps,
        }))

        const mappedEvents = parsedData.events.map((event) => ({
            name: event.event_name,
            timestamp: event.event_timestamp,
            streamId: event.stream_id,
        }))

        return {
            path,
            streams: mappedStreams,
            events: mappedEvents,
        }
    }

    private get unmangledNames() {
        return LibxdfAdapter.unmangledNames
    }

    private get loadXdfName() {
        return LibxdfAdapter.loadXdfName
    }

    private static MangledNameExtractor() {
        return MangledNameExtractorImpl.Create()
    }
}

export interface Libxdf {
    loadXdf(path: string): XdfFile
}

export type LibxdfConstructor = new (
    libxdfPath: string,
    mangledNameMap: MangledNameMap
) => Libxdf

export type LibxdfBindings = Record<string, (path: string[]) => string>

export type LibxdfStatusCode = 0 | Exclude<number, 0>

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export interface LibxdfFile {
    streams: LibxdfStream[]
    events: LibxdfEvent[]
}

export interface LibxdfStream {
    stream_id: number
    stream_info: LibxdfStreamInfo
    time_series: number[][]
    time_stamps: number[]
}

export interface LibxdfStreamInfo {
    channel_count: number
    channel_format: string
    nominal_srate: number
    stream_name: string
    stream_type: string
}

export const InfoAttributeMap = {
    channel_count: 'channelCount',
    channel_format: 'channelFormat',
    nominal_srate: 'nominalSampleRateHz',
    stream_name: 'streamName',
    stream_type: 'streamType',
}

export interface LibxdfEvent {
    stream_id: number
    event_name: string
    event_timestamp: number
}

export const EventAttributeMap = {
    stream_id: 'streamId',
    event_name: 'eventName',
    event_timestamp: 'eventTimestamp',
}
