import BaseSpruceError from '@sprucelabs/error'
import ErrorOptions, {
    FailedToLoadLibxdfErrorOptions,
    InvalidTimeoutMsErrorOptions,
} from '#spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
    /** an easy to understand version of the errors */
    public friendlyMessage(): string {
        const { options } = this
        let message
        switch (options?.code) {
            case 'INVALID_TIMEOUT_MS':
                message = this.generatedInvalidMessage(options)
                break

            case 'FAILED_TO_LOAD_LIBXDF':
                message = this.generateFailedMessage(options)
                break

            default:
                message = super.friendlyMessage()
        }

        const fullMessage = options.friendlyMessage
            ? options.friendlyMessage
            : message

        return fullMessage
    }

    private generatedInvalidMessage(options: InvalidTimeoutMsErrorOptions) {
        return `
			\n -----------------------------------
			\n You set an invalid timeout! 
			\n It must be a positive number in milliseconds, not "${options?.timeoutMs}".
			\n -----------------------------------
		`
    }

    private generateFailedMessage(options: FailedToLoadLibxdfErrorOptions) {
        return `
			\n -----------------------------------
			\n Failed to load libxdf! Tried to load from: 
			\n     ${options?.libxdfPath}
			\n Instructions to save your day (on MacOS):
			\n     1. git clone https://github.com/neurodevs/libxdf.git
			\n     2. cd libxdf && cmake -S . -B build && cmake --build build
			\n     3. sudo cp build/libxdf.dylib /opt/local/lib/
			\n     4. Try whatever you were doing again!
			\n Modify step 3 for your OS if you are not on MacOS.
			\n Check the official repo for OS-specific instructions:
			\n     https://github.com/xdf-modules/libxdf
			\n If you're still unsure, ask an LLM with this error and your OS. 
			\n You could also post an issue on the repo:
			\n     https://github.com/neurodevs/node-xdf/issues
			\n Good luck!
			\n @ericthecurious
			\n -----------------------------------
		`
    }
}
