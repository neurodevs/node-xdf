import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'







export declare namespace SpruceErrors.NodeXdf {

	
	export interface InvalidTimeoutMs {
		
			
			'timeoutMs': number
	}

	export interface InvalidTimeoutMsSchema extends SpruceSchema.Schema {
		id: 'invalidTimeoutMs',
		namespace: 'NodeXdf',
		name: 'Invalid Timeout Ms',
		    fields: {
		            /** . */
		            'timeoutMs': {
		                type: 'number',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidTimeoutMsEntity = SchemaEntity<SpruceErrors.NodeXdf.InvalidTimeoutMsSchema>

}


export declare namespace SpruceErrors.NodeXdf {

	
	export interface InvalidFileExtension {
		
			
			'savePath': string
	}

	export interface InvalidFileExtensionSchema extends SpruceSchema.Schema {
		id: 'invalidFileExtension',
		namespace: 'NodeXdf',
		name: 'INVALID_FILE_EXTENSION',
		    fields: {
		            /** . */
		            'savePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidFileExtensionEntity = SchemaEntity<SpruceErrors.NodeXdf.InvalidFileExtensionSchema>

}


export declare namespace SpruceErrors.NodeXdf {

	
	export interface FailedToLoadLibxdf {
		
			
			'libxdfPath': string
	}

	export interface FailedToLoadLibxdfSchema extends SpruceSchema.Schema {
		id: 'failedToLoadLibxdf',
		namespace: 'NodeXdf',
		name: 'Failed to Load Libxdf',
		    fields: {
		            /** . */
		            'libxdfPath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type FailedToLoadLibxdfEntity = SchemaEntity<SpruceErrors.NodeXdf.FailedToLoadLibxdfSchema>

}




