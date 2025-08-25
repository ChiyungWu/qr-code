const cryptoKey = 'ByKeon.com';
const MAX_LEN = 1024;

export const encryptXor = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map((b, i) =>
      (b ^ cryptoKey.charCodeAt(i % cryptoKey.length))
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
};

export const decryptXor = (hex: string): string => {
  try {
    if (hex.length / 6 > MAX_LEN) return '';
    const bytes = hex
      .match(/.{1,2}/g)
      ?.map(
        (h, i) => parseInt(h, 16) ^ cryptoKey.charCodeAt(i % cryptoKey.length)
      );
    if (!bytes) return '';
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return '';
  }
};
