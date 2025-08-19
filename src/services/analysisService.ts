// src/services/analysisService.ts
import axios from 'axios';
import { logger } from '@/utils/logger';

const AI_API_BASE_URL = 'http://localhost:8001/api/v1';

// AI 분석 API 클라이언트 생성
const aiClient = axios.create({
    baseURL: AI_API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
    timeout: 60000, // 60초 타임아웃 (AI 분석은 시간이 걸릴 수 있음)
});

// 요청 인터셉터
aiClient.interceptors.request.use(
    (config) => {
        logger.info('AI 분석 API 요청 시작', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            hasData: !!config.data
        });
        return config;
    },
    (error) => {
        logger.error('AI API 요청 인터셉터 오류', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
aiClient.interceptors.response.use(
    (response) => {
        logger.info('AI 분석 API 응답 수신', {
            status: response.status,
            url: response.config.url,
            responseSize: JSON.stringify(response.data).length
        });
        return response;
    },
    (error) => {
        logger.error('AI 분석 API 오류 응답', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

// 인터페이스 정의
export interface AnalysisResult {
    id: string;
    predicted_disease: string;
    confidence: number;
    summary: string;
    recommendation: string;
    similar_diseases?: Array<{
        name: string;
        confidence: number;
        description: string;
    }>;
    metadata: {
        processing_time_seconds: number;
        image_info?: {
            width: number;
            height: number;
            format: string;
            mode: string;
        };
        image_size_kb?: number;
        timestamp: string;
    };
}

export interface AnalysisRequest {
    imageUrl: string;
    additionalInfo?: string;
    responseFormat?: 'JSON' | 'XML';
}

// 분석 서비스
export const analysisService = {
    /**
     * 이미지 URL로부터 AI 분석 수행
     */
    async analyzeImageFromUrl(request: AnalysisRequest): Promise<AnalysisResult> {
        try {
            logger.info('이미지 URL 분석 시작', {
                imageUrl: request.imageUrl.substring(0, 50) + '...',
                imageSize: request.imageUrl.length,
                hasAdditionalInfo: !!request.additionalInfo
            });

            // base64 이미지를 Blob으로 변환
            const imageBlob = await this.base64ToBlob(request.imageUrl);
            
            logger.info('이미지 변환 완료', {
                blobSize: imageBlob.size,
                blobType: imageBlob.type
            });

            // FormData 생성
            const formData = new FormData();
            formData.append('image', imageBlob, 'analysis_image.jpg');
            
            if (request.additionalInfo) {
                formData.append('additional_info', request.additionalInfo);
            }
            
            if (request.responseFormat) {
                formData.append('response_format', request.responseFormat.toLowerCase());
            }

            logger.info('AI 분석 요청 전송 중...');

            const response = await aiClient.post('/diagnose/skin-lesion-image', formData);
            
            logger.info('AI 분석 완료', {
                analysisId: response.data.id,
                predictedDisease: response.data.predicted_disease,
                confidence: response.data.confidence,
                processingTime: response.data.metadata?.processing_time_seconds
            });

            return response.data;

        } catch (error: any) {
            logger.error('AI 분석 실패', {
                error: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data
            });
            throw error;
        }
    },

    /**
     * 파일 객체로 AI 분석 수행
     */
    async analyzeImageFromFile(file: File, additionalInfo?: string): Promise<AnalysisResult> {
        try {
            logger.info('파일 분석 시작', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                hasAdditionalInfo: !!additionalInfo
            });

            const formData = new FormData();
            formData.append('image', file);
            
            if (additionalInfo) {
                formData.append('additional_info', additionalInfo);
            }
            
            formData.append('response_format', 'json');

            logger.info('AI 분석 요청 전송 중...');

            const response = await aiClient.post('/diagnose/skin-lesion-image', formData);
            
            logger.info('AI 분석 완료', {
                analysisId: response.data.id,
                predictedDisease: response.data.predicted_disease,
                confidence: response.data.confidence,
                processingTime: response.data.metadata?.processing_time_seconds
            });

            return response.data;

        } catch (error: any) {
            logger.error('AI 분석 실패', {
                error: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data
            });
            throw error;
        }
    },

    /**
     * base64 이미지를 Blob으로 변환
     */
    async base64ToBlob(base64String: string): Promise<Blob> {
        try {
            // data:image/jpeg;base64, 부분 제거
            const base64Data = base64String.split(',')[1] || base64String;
            const mimeType = base64String.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
            
            // base64를 바이너리로 변환
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            
            return new Blob([byteArray], { type: mimeType });
            
        } catch (error) {
            logger.error('base64 to Blob 변환 실패', error);
            throw new Error('이미지 변환 중 오류가 발생했습니다.');
        }
    },

    /**
     * 분석 이력 조회
     */
    async getAnalysisHistory(limit: number = 10): Promise<AnalysisResult[]> {
        try {
            logger.info('분석 이력 조회 시작', { limit });

            // 실제 구현에서는 백엔드 API 호출
            // const response = await aiClient.get(`/analysis/history?limit=${limit}`);
            
            // 임시 구현 (개발용)
            logger.warn('분석 이력 조회 - 아직 구현되지 않음');
            return [];

        } catch (error: any) {
            logger.error('분석 이력 조회 실패', error);
            throw error;
        }
    },

    /**
     * 특정 분석 결과 조회
     */
    async getAnalysisById(analysisId: string): Promise<AnalysisResult> {
        try {
            logger.info('분석 결과 조회', { analysisId });

            // 실제 구현에서는 백엔드 API 호출
            // const response = await aiClient.get(`/analysis/${analysisId}`);
            
            // 임시 구현 (개발용)
            logger.warn('분석 결과 조회 - 아직 구현되지 않음');
            throw new Error('분석 결과를 찾을 수 없습니다.');

        } catch (error: any) {
            logger.error('분석 결과 조회 실패', error);
            throw error;
        }
    },

    /**
     * AI 서비스 상태 확인
     */
    async checkServiceHealth(): Promise<boolean> {
        try {
            logger.info('AI 서비스 상태 확인');
            
            const response = await axios.get(`${AI_API_BASE_URL}/`, { timeout: 5000 });
            
            const isHealthy = response.status === 200;
            logger.info('AI 서비스 상태 확인 완료', { 
                isHealthy,
                status: response.status 
            });
            
            return isHealthy;

        } catch (error: any) {
            logger.warn('AI 서비스 상태 확인 실패', {
                error: error.message,
                status: error.response?.status
            });
            return false;
        }
    }
};

export default analysisService;
