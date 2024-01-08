import XdfReaderImpl from './XdfReader'

export { default as XdfReaderImpl } from './XdfReader'
export * from './XdfReader'

async function main() {
	const xdfReader = XdfReaderImpl.Reader()
	const data = await xdfReader.load(
		'/Users/ericyates/sessions/user_65958e3e0f960597b9dc23da/session_866.xdf'
	)
	console.log(data)
}

main()
