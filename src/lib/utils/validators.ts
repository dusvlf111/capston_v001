import { z } from 'zod';
import { ACTIVITY_TYPES } from '@/types/api';
import type { ReportRequest } from '@/types/api';

const coordinateSchema = z.object({
  latitude: z.number().gte(-90, '위도는 -90 이상이어야 합니다.').lte(90, '위도는 90 이하여야 합니다.'),
  longitude: z.number().gte(-180, '경도는 -180 이상이어야 합니다.').lte(180, '경도는 180 이하여야 합니다.')
});

const locationSchema = z.object({
  name: z.string().min(2, '위치명을 입력하세요.'),
  coordinates: coordinateSchema
});

const activityTypeEnum = z.enum(
  [...ACTIVITY_TYPES] as [
    (typeof ACTIVITY_TYPES)[number],
    ...(typeof ACTIVITY_TYPES)[number][]
  ]
);

const activitySchema = z
  .object({
    type: activityTypeEnum,
    startTime: z.string().min(1, '시작 시간을 입력하세요.').datetime({ message: '시작 시간을 ISO 형식으로 입력하세요.' }),
    endTime: z.string().datetime({ message: '종료 시간을 ISO 형식으로 입력하세요.' }).optional().or(z.literal('')),
    participants: z
      .number()
      .int('참가자 수는 정수여야 합니다.')
      .min(1, '참가자 수는 1명 이상이어야 합니다.')
      .max(200, '참가자 수는 200명을 초과할 수 없습니다.')
  })
  .refine(
    ({ startTime, endTime }) => {
      if (!endTime || endTime === '') return true;
      return new Date(endTime).getTime() > new Date(startTime).getTime();
    },
    {
      message: '종료 시간은 시작 시간 이후여야 합니다.',
      path: ['endTime']
    }
  );

export const phonePattern = /^010-\d{4}-\d{4}$/;

const contactSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  phone: z.string().regex(phonePattern, '전화번호는 010-XXXX-XXXX 형식이어야 합니다.'),
  emergencyContact: z
    .string()
    .regex(phonePattern, '응급 연락처는 010-XXXX-XXXX 형식이어야 합니다.')
});

const companionSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  phone: z.string().regex(phonePattern, '전화번호는 010-XXXX-XXXX 형식이어야 합니다.'),
  emergencyContact: z
    .string()
    .regex(phonePattern, '응급 연락처는 010-XXXX-XXXX 형식이어야 합니다.')
});

export const reportSchema = z.object({
  location: locationSchema,
  activity: activitySchema,
  contact: contactSchema,
  notes: z.string().max(500, '비고는 500자 이하여야 합니다.').optional(),
  companions: z.array(companionSchema).optional()
});

export type ReportSchema = z.infer<typeof reportSchema>;

export const parseReport = (payload: unknown): ReportRequest => {
  return reportSchema.parse(payload);
};
