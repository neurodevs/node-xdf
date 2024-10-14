import { assertOptions } from '@sprucelabs/schema'
import { DataType, define, FieldType, FuncObj, open } from 'ffi-rs'
import SpruceError from './errors/SpruceError'

export default class LibxdfImpl implements Libxdf {
	public static Class?: LibxdfConstructor
	public static ffiRsOpen = open
	public static ffiRsDefine = define

	protected bindings!: LibxdfBindings
	private libxdfPath: string

	protected constructor(libxdfPath: string) {
		this.libxdfPath = libxdfPath
		this.tryToLoadBindings()
	}

	public static Create(libxdfPath: string) {
		assertOptions({ libxdfPath }, ['libxdfPath'])
		return new (this.Class ?? this)(libxdfPath)
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
		return LibxdfImpl.ffiRsDefine({
			load_xdf: {
				library: 'xdf',
				retType: DataType.External,
				paramsType: [DataType.String],
			},
		})
	}

	public loadXdf(path: string) {
		return this.bindings.load_xdf([path])
	}
}

export interface Libxdf {
	loadXdf(path: string): XdfFile
}

export type LibxdfConstructor = new (libxdfPath: string) => Libxdf

export interface LibxdfBindings {
	load_xdf(path: string[]): XdfFile
}

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export type XdfFile = any
