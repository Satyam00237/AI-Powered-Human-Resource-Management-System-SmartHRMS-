/**
 * Resume Service
 * Handles PDF extraction and resume document parsing.
 */
export async function parsePdfBuffer(buffer) {
  if (!buffer) {
    throw new Error('No PDF file buffer provided.');
  }

  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  const parsedPdf = await parser.getText();
  const textContent = parsedPdf.text || '';
  await parser.destroy();

  const trimmed = textContent.trim();
  if (!trimmed) {
    throw new Error('Could not extract text content from the PDF file.');
  }

  return trimmed;
}

export default {
  parsePdfBuffer
};
