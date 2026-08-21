const textEncoder = new TextEncoder();

const asBody = (value: ArrayBuffer | Uint8Array | string) =>
  typeof value === "string" ? textEncoder.encode(value) : value;

export const putEmailObject = async (
  env: Env,
  key: string,
  value: ArrayBuffer | Uint8Array | string,
  contentType: string,
) => {
  await env.EMAIL_OBJECTS.put(key, asBody(value), {
    httpMetadata: { contentType },
    customMetadata: { visibility: "private" },
  });
  return key;
};

export const readEmailText = async (env: Env, key: string | null) => {
  if (!key) return null;

  const object = await env.EMAIL_OBJECTS.get(key);
  if (!object) return null;
  return object.text();
};

export const readEmailObject = (env: Env, key: string) => env.EMAIL_OBJECTS.get(key);

export const deleteEmailObjects = async (env: Env, keys: string[]) => {
  if (keys.length > 0) await env.EMAIL_OBJECTS.delete(keys);
};
