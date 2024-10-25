import BaseSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
	/** an easy to understand version of the errors */
	public friendlyMessage(): string {
		const { options } = this
		let message
		switch (options?.code) {
			case 'INVALID_TIMEOUT_MS':
				message = `You set an invalid timeout! It must be a positive number in milliseconds, but you set it to ${options?.timeoutMs}.`
				break

			case 'FAILED_TO_LOAD_LIBXDF':
				message = `
\nFailed to load libxdf bindings! Tried to load from: 

  ${options?.libxdfPath}

Setup instructions to save your day (on MacOS):

  1. git clone https://github.com/neurodevs/libxdf.git

  2. cd libxdf && cmake -S . -B build && cmake --build build

  3. sudo cp build/libxdf.dylib /usr/local/lib/
  
  4. Try whatever you were doing again!

Modify step 3 for your OS if you are not on MacOS.

If you're unsure how, ask an LLM with this error and your OS.

Good luck!\n
					`
				break

			default:
				message = super.friendlyMessage()
		}

		const fullMessage = options.friendlyMessage
			? options.friendlyMessage
			: message

		return fullMessage
	}
}
