import { Injectable } from '@angular/core';
import { ExtractedData } from '../models/extracted-data.model';

export interface OcrResult {
  fullText: string;
  extractedData: ExtractedData;
}

@Injectable({ providedIn: 'root' })
export class OcrService {

  // This is a mock function. Replace this with a real API call.
  processImage(file: File): Promise<OcrResult> {
    console.log('Simulating OCR processing for file:', file.name);

    return new Promise(resolve => {
      setTimeout(() => {
        const mockResult: OcrResult = {
          fullText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
GIẤY CHỨNG MINH NHÂN DÂN
Số: 0123456789
Họ và tên: NGUYỄN VĂN A
Ngày sinh: 01/01/1990
Nguyên quán: Xã A, Huyện B, Tỉnh C
Nơi ĐKHK thường trú: Số 1, Đường X, Phường Y, Quận Z, Thành phố Hà Nội
Dân tộc: Kinh Tôn giáo: Không
Dấu vân tay:
[Dấu vân tay]
Ngày cấp: 20/10/2020
GIÁM ĐỐC CÔNG AN TỈNH
`,
          extractedData: {
            fullName: 'NGUYỄN VĂN A',
            idNumber: '0123456789',
            issueDate: '10/20/2020',
            address: 'Số 1, Đường X, Phường Y, Quận Z, Thành phố Hà Nội',
          },
        };
        console.log('Mock OCR processing complete.');
        resolve(mockResult);
      }, 1500); // Simulate 1.5 second network and processing delay
    });
  }

  /*
  // ======================================================================
  // GEMINI API INTEGRATION EXAMPLE
  // ======================================================================
  // To integrate with the Gemini API, you would replace the mock `processImage` 
  // function with something like the following.
  //
  // 1. First, you need to set up the Gemini client.
  //
  // import { GoogleGenAI, Type } from '@google/genai';
  //
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  //
  // 2. Then, create a function to process the image.
  //
  async processImageWithGemini(file: File): Promise<OcrResult> {
    
    // Helper function to convert a File to a base64 string
    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });

    try {
      const base64Image = await toBase64(file);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Image,
              },
            },
            {
              text: 'Từ hình ảnh giấy tờ tùy thân này, hãy trích xuất các thông tin sau: Họ tên, Số CCCD/CMND, Ngày cấp, và Địa chỉ thường trú. Đồng thời, cung cấp toàn bộ văn bản gốc đã nhận diện được.',
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING, description: 'Họ và tên đầy đủ, viết hoa.' },
              idNumber: { type: Type.STRING, description: 'Số Căn cước công dân hoặc Chứng minh nhân dân.' },
              issueDate: { type: Type.STRING, description: 'Ngày cấp theo định dạng MM/DD/YYYY.' },
              address: { type: Type.STRING, description: 'Địa chỉ thường trú đầy đủ.' },
              fullText: { type: Type.STRING, description: 'Toàn bộ văn bản gốc nhận diện được từ hình ảnh.' },
            },
          },
        },
      });

      const resultJson = JSON.parse(response.text);
      
      const result: OcrResult = {
        fullText: resultJson.fullText,
        extractedData: {
          fullName: resultJson.fullName,
          idNumber: resultJson.idNumber,
          issueDate: resultJson.issueDate,
          address: resultJson.address,
        }
      };
      
      return result;

    } catch (error) {
      console.error('Error processing image with Gemini API:', error);
      throw new Error('Failed to extract data using Gemini API.');
    }
  }
  */
}
