import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';
import Ajv, { type JSONSchemaType } from 'ajv';

// Import the native module. On web, it will be resolved to ExpoAndroidUtils.web.ts
// and on native platforms to ExpoAndroidUtils.ts
import ExpoAndroidUtilsModule from './ExpoAndroidUtilsModule';
import ExpoAndroidUtilsView from './ExpoAndroidUtilsView';
import { ChangeEventPayload, ExpoAndroidUtilsViewProps } from './ExpoAndroidUtils.types';

const emitter = new EventEmitter(ExpoAndroidUtilsModule ?? NativeModulesProxy.ExpoAndroidUtils);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoAndroidUtilsView, ExpoAndroidUtilsViewProps, ChangeEventPayload };


/**
 * Generates a pair of RSA keys: a private key and a public key.
 * The private key is kept securely in the KeyStore on Android.
 * The public key is returned as a base64 string.
 *
 * @return A promise that resolves with an object containing a public key in base64 format
 */
export function generateRsaKeyPair(): Promise<RSAKeyPair> {
  return ExpoAndroidUtilsModule.generateRsaKeyPair();
}

/**
 * Generates an AES key for encryption. The key is kept securely in the KeyStore.
 * @return A promise that resolves with an object containing the AES key in base64 format
 */
export function generateAesKey(): Promise<AESSecret> {
  return ExpoAndroidUtilsModule.generateAesKey();
}


/**
 * Saves a string to the device's SharedPreferences.
 * @param key The key to save the value under
 * @param value The value to save
 * @return A promise that resolves when the value is saved
 */
export function saveStringData(
  key: string,
  value: string
): Promise<GenericResponse> {
  return ExpoAndroidUtilsModule.saveStringData(key, value);
}

/**
 * Saves a boolean value to the device's SharedPreferences.
 * @param key The key to save the value under
 * @param value The value to save
 * @return A promise that resolves when the value is saved
 */
export function saveBoolData(
  key: string,
  value: boolean
): Promise<GenericResponse> {
  return ExpoAndroidUtilsModule.saveBoolData(key, value);
}

/**
 * Retrieves a string value from the device's SharedPreferences.
 * @param key The key to retrieve the value from
 * @return A promise that resolves with an object containing the value
 */
export function getStringData(key: string): Promise<GetStringDataResponse> {
  return ExpoAndroidUtilsModule.getStringData(key);
}

/**
 * Retrieves a boolean value from the device's SharedPreferences.
 * @param key The key to retrieve the value from
 * @return A promise that resolves with an object containing the value
 */
export function getBoolData(key: string): Promise<GetBoolDataResponse> {
  return ExpoAndroidUtilsModule.getBoolData(key);
}

/**
 * Clears a value from the device's SharedPreferences.
 * @param key The key to clear the value for
 * @return A promise that resolves when the value is cleared
 */
export function clearData(key: string): Promise<GenericResponse> {
  return ExpoAndroidUtilsModule.clearData(key);
}


/**
 * Handles encryption of the CMT request.
 * @param payload The payload to prepare
 * @return A promise that resolves with the prepared payload
 */
export function prepareRequestPayload(
  payload: RequestPayload
): Promise<PreparedRequest> {
  return ExpoAndroidUtilsModule.prepareRequestPayload(payload);
}

/**
 * Handles decryption of the CMT response.
 * @param payload The payload to parse
 * @return A promise that resolves with the parsed payload
 */
export function parseResponsePayload(payload: string): Promise<ParsedResponse> {
  return ExpoAndroidUtilsModule.parseResponsePayload(payload);
}

/**
 * Validates the given CMT schema against the expected interface.
 * @param data The schema to validate
 * @return A promise that resolves with true if the schema is valid, false otherwise
 */
export function isCmtSchemaValid(data: CmtSchema): Promise<boolean> {
  const ajv = new Ajv();
  const validate = ajv.compile(interfaceSchema);
  return Promise.resolve(validate(data));
}

export interface RSAKeyPair {
  publicKey: string;
}

export interface RequestPayload {
  cmt: string;
  bridgeRaPublicKey: string;
}

export interface GenericResponse {
  success: boolean;
}

export interface GetStringDataResponse {
  data: string;
}

export interface GetBoolDataResponse {
  data: boolean;
}

export interface AESSecret {
  aesSecret: string;
}

export interface PreparedRequest {
  requestData: string;
}

export interface ParsedResponse {
  responseData: string;
}

// TypeScript interface based on schema
interface CmtSchema {
  systemInfo: {
    originatingSystem?: string;
    idempotencyKey?: string;
    type: string; // Required
  };
  commonAttributes: {
    clientAppDetails?: {
      productOffering?: string;
      cpdiClientType?: string;
      reliantAppId?: string;
    };
    serviceProvider: {
      type?: string;
      region?: string;
      id?: string;
      participationProgramId: string; // Required
      acceptor?: {
        type?: string;
        id?: string;
      };
    };
    agent?: {
      cpid?: string;
      id?: string;
      name?: string;
    };
    credentialHolderDetails?: {
      cmIssuedRid?: string;
      amrid?: string;
      spId?: string;
    };
    transaction?: {
      tagId?: string;
      status?: string;
    };
  };
  payload: {
    [index: string]: unknown;
  }; // Required
  custom?: Record<string, unknown>;
}

// JSON schema for the interface
const interfaceSchema: JSONSchemaType<CmtSchema> = {
  type: 'object',
  properties: {
    systemInfo: {
      type: 'object',
      properties: {
        originatingSystem: { type: 'string', nullable: true },
        idempotencyKey: { type: 'string', nullable: true },
        type: { type: 'string', enum: ['Request', 'Response'] }, // Enum
      },
      required: ['type'],
    },
    commonAttributes: {
      type: 'object',
      properties: {
        clientAppDetails: {
          type: 'object',
          properties: {
            productOffering: { type: 'string', nullable: true },
            cpdiClientType: { type: 'string', nullable: true },
            reliantAppId: { type: 'string', nullable: true },
          },
          nullable: true,
        },
        serviceProvider: {
          type: 'object',
          properties: {
            type: { type: 'string', nullable: true },
            region: { type: 'string', nullable: true },
            id: { type: 'string', nullable: true },
            participationProgramId: { type: 'string' }, // Required
            acceptor: {
              type: 'object',
              properties: {
                type: { type: 'string', nullable: true },
                id: { type: 'string', nullable: true },
              },
              nullable: true,
            },
          },
          required: ['participationProgramId'],
        },
        agent: {
          type: 'object',
          properties: {
            cpid: { type: 'string', nullable: true },
            id: { type: 'string', nullable: true },
            name: { type: 'string', nullable: true },
          },
          nullable: true,
        },
        credentialHolderDetails: {
          type: 'object',
          properties: {
            cmIssuedRid: { type: 'string', nullable: true },
            amrid: { type: 'string', nullable: true },
            spId: { type: 'string', nullable: true },
          },
          nullable: true,
        },
        transaction: {
          type: 'object',
          properties: {
            tagId: { type: 'string', nullable: true },
            status: { type: 'string', nullable: true },
          },
          nullable: true,
        },
      },
      required: ['serviceProvider'],
    },
    payload: { type: 'object' }, // Required
    custom: { type: 'object', nullable: true },
  },
  required: ['systemInfo', 'commonAttributes', 'payload'],
  additionalProperties: false,
};

