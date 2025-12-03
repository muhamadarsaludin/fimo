export async function handleApi<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise
  } catch (err: any) {
    throw new Error(err?.response?.data?.Error || err?.message || "API error")
  }
}
