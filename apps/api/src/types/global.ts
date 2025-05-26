declare global {
  var imageCache: Record<string, {
    buffer: Buffer;
    contentType: string;
    ready: boolean;
  }> | undefined;
}

export {}; 