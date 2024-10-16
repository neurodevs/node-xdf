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
	private static unmangledNames = ['load_xdf']

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
		const extractor = MangledNameExtractorImpl.Create()
		const mangledNameMap = await extractor.extract(
			libxdfPath,
			this.unmangledNames
		)
		return new (this.Class ?? this)(libxdfPath, mangledNameMap)
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
			library: 'libxdf',
			path: this.libxdfPath,
		})
	}

	private defineBindings() {
		const funcs = this.unmangledNames.reduce((acc, name) => {
			const mangledName = this.mangledNameMap[name]

			// @ts-ignore
			acc[mangledName] = {
				library: 'libxdf',
				retType: DataType.I32,
				paramsType: [DataType.String],
			}
			return acc
		}, {})

		return LibxdfImpl.ffiRsDefine(funcs)
	}

	public loadXdf(path: string) {
		return this.bindings.load_xdf([path])
	}

	private get unmangledNames() {
		return LibxdfImpl.unmangledNames
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
	[mangledLoadXdfName: string]: (path: string[]) => LibxdfStatusCode
}

export type LibxdfStatusCode = 0 | Exclude<number, 0>

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export type XdfFile = any
