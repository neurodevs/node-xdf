import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidFileExtensionSchema: SpruceErrors.NodeXdf.InvalidFileExtensionSchema  = {
	id: 'invalidFileExtension',
	namespace: 'NodeXdf',
	name: 'INVALID_FILE_EXTENSION',
	    fields: {
	            /** . */
	            'xdfRecordPath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidFileExtensionSchema)

export default invalidFileExtensionSchema
