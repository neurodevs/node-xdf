import { assertOptions } from '@sprucelabs/schema'
import {
	MangledNameExtractorImpl,
	MangledNameMap,
} from '@neurodevs/node-mangled-names'
import { DataType, define, FieldType, FuncObj, open } from 'ffi-rs'
import SpruceError from './errors/SpruceError'

export default class LibxdfImpl implements Libxdf {
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

	public static async Create(libxdfPath: string) {
		assertOptions({ libxdfPath }, ['libxdfPath'])
		const mangledNameMap = await this.loadMangledNameMap(libxdfPath)
		return new (this.Class ?? this)(libxdfPath, mangledNameMap)
	}

	private static async loadMangledNameMap(libxdfPath: string) {
		const extractor = MangledNameExtractorImpl.Create()
		return await extractor.extract(libxdfPath, this.unmangledNames)
	}

	private tryToLoadBindings() {
		try {
			this.bindings = this.loadBindings()
		} catch (err: any) {
			throw new SpruceError({
				code: 'FAILED_TO_LOAD_LIBXDF',
				libxdfPath: this.libxdfPath,
				originalError: err,
			})
		}
	}

	private loadBindings() {
		this.openLibxdf()
		return this.defineBindings()
	}

	private openLibxdf() {
		LibxdfImpl.ffiRsOpen({
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

		return LibxdfImpl.ffiRsDefine(funcs)
	}

	public loadXdf(path: string) {
		const mangledName = this.mangledNameMap[this.loadXdfName].slice(1)
		const mangledFunc = this.bindings[mangledName]
		const serializedData = mangledFunc([path])
		const parsedData = JSON.parse(serializedData)
		return parsedData
	}

	private get unmangledNames() {
		return LibxdfImpl.unmangledNames
	}

	private get loadXdfName() {
		return LibxdfImpl.loadXdfName
	}
}

export interface Libxdf {
	loadXdf(path: string): XdfFile
}

export type LibxdfConstructor = new (
	libxdfPath: string,
	mangledNameMap: MangledNameMap
) => Libxdf

export interface LibxdfBindings {
	[mangledLoadXdfName: string]: (path: string[]) => string
}

export type LibxdfStatusCode = 0 | Exclude<number, 0>

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export type XdfFile = any
