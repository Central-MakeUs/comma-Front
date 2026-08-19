export const MAX_UPLOAD_FILE_SIZE = 15 * 1024 * 1024;

export function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
        return;
      }

      const separatorIndex = reader.result.indexOf(',');
      if (separatorIndex < 0) {
        reject(new Error('선택한 사진 데이터를 읽지 못했어요.'));
        return;
      }
      resolve(reader.result.slice(separatorIndex + 1));
    };
    reader.readAsDataURL(file);
  });
}
