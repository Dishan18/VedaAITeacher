declare module "pdf-parse" {
  const pdf: (dataBuffer: Buffer) => Promise<{ text: string; numpages: number; info: unknown; metadata: unknown }>;
  export default pdf;
}
