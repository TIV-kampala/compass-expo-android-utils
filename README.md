# compass-expo-android-utils

Community pass Expo android native utility functions

# Installation in managed Expo projects

```
npx expo install compass-expo-android-utils
```

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install compass-expo-android-utils
```

# API Documentation

1. `generateRsaKeyPair()`
   Generates a pair of RSA keys: a private key stored securely in the Android KeyStore and a public key returned as a base64 string.

Returns:

- `Promise<RSAKeyPair>`: Resolves with an object containing the public key in base64 format.

```ts
interface RSAKeyPair {
  publicKey: string;
}
```

2. `generateAesKey()`
   Generates an AES key for encryption, which is securely stored in the Android KeyStore.

Returns:

- `Promise<AESSecret>`: Resolves with an object containing the AES key in base64 format.

```ts
interface AESSecret {
  aesSecret: string;
}
```

3. `saveStringData(key: string, value: string)`
   Saves a string value to the device's SharedPreferences.

Parameters:

- `key` (string): The key under which the value is saved.
- `value` (string): The string value to be saved.
  Returns:
- `Promise<GenericResponse>`: Resolves when the value is saved.

```ts
interface GenericResponse {
  success: boolean;
}
```

4. `saveBoolData(key: string, value: boolean)`
   Saves a boolean value to the device's SharedPreferences.

Parameters:

- `key` (string): The key under which the value is saved.
- `value` (boolean): The boolean value to be saved.
  Returns:
- `Promise<GenericResponse>`: Resolves when the value is saved.

5. `getStringData(key: string)`
   Retrieves a string value from the device's SharedPreferences.

Parameters:

- `key` (string): The key for which the value is retrieved.
  Returns:
- `Promise<GetStringDataResponse>`: Resolves with an object containing the value.

```ts
interface GetStringDataResponse {
  data: string;
}
```

6. `getBoolData(key: string)`
   Retrieves a boolean value from the device's SharedPreferences.

Parameters:

- `key` (string): The key for which the value is retrieved.
  Returns:
- `Promise<GetBoolDataResponse>`: Resolves with an object containing the value.

```ts
interface GetBoolDataResponse {
  data: boolean;
}
```

7. `clearData(key: string)`
   Clears a value from the device's SharedPreferences.

Parameters:

- `key` (string): The key for which the value is cleared.
  Returns:
- `Promise<GenericResponse>`: Resolves when the value is cleared.

8. `prepareRequestPayload(payload: RequestPayload)`
   Handles encryption of the CMT request payload.

Parameters:
payload (RequestPayload): The payload to prepare.
Returns:

- `Promise<PreparedRequest>`: Resolves with the encrypted request payload.

```ts
interface RequestPayload {
  cmt: string;
  bridgeRaPublicKey: string;
}

interface PreparedRequest {
  requestData: string;
}
```

9. `parseResponsePayload(payload: string)`
   Handles decryption of the CMT response payload.

Parameters:

- `payload` (string): The payload to parse.
  Returns:
- `Promise<ParsedResponse>`: Resolves with the decrypted response payload.

```ts
interface ParsedResponse {
  responseData: string;
}
```

10. `isCmtSchemaValid(data: CmtSchema)`
    Validates the given CMT schema against the expected interface.

Parameters:

- `data` (CmtSchema): The schema to validate.
  Returns:
- `Promise<boolean>`: Resolves with true if the schema is valid, otherwise false.

```ts
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
```

# Contributing

Feel free to contribute to this library by submitting issues and pull requests.
