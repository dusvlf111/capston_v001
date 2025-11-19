import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ReportForm from '../ReportForm';
import type { ReportResponse } from '@/types/api';
import { useController } from 'react-hook-form';

vi.mock('../LocationSelector', () => ({
  __esModule: true,
  default: ({ control }: any) => {
    const nameField = useController({ name: 'location.name', control }).field;
    const latField = useController({ name: 'location.coordinates.latitude', control }).field;
    const lngField = useController({ name: 'location.coordinates.longitude', control }).field;

    return (
      <button
        type="button"
        data-testid="fill-location"
        onClick={() => {
          nameField.onChange('부산 해운대');
          latField.onChange(35.158);
          lngField.onChange(129.16);
        }}
      >
        위치 채우기
      </button>
    );
  },
}));

vi.mock('../ActivitySelector', () => ({
  __esModule: true,
  default: ({ control }: any) => {
    const typeField = useController({ name: 'activity.type', control }).field;
    const startField = useController({ name: 'activity.startTime', control }).field;
    const endField = useController({ name: 'activity.endTime', control }).field;
    const participantsField = useController({ name: 'activity.participants', control }).field;

    return (
      <button
        type="button"
        data-testid="fill-activity"
        onClick={() => {
          typeField.onChange('카약');
          startField.onChange('2025-05-05T09:00:00Z');
          endField.onChange('2025-05-05T11:00:00Z');
          participantsField.onChange(4);
        }}
      >
        활동 채우기
      </button>
    );
  },
}));

vi.mock('../ContactForm', () => ({
  __esModule: true,
  default: ({ control }: any) => {
    const nameField = useController({ name: 'contact.name', control }).field;
    const phoneField = useController({ name: 'contact.phone', control }).field;
    const emergencyField = useController({ name: 'contact.emergencyContact', control }).field;

    return (
      <button
        type="button"
        data-testid="fill-contact"
        onClick={() => {
          nameField.onChange('홍길동');
          phoneField.onChange('010-1234-5678');
          emergencyField.onChange('010-8765-4321');
        }}
      >
        연락처 채우기
      </button>
    );
  },
}));

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByTestId('fill-location'));
  await user.click(screen.getByTestId('fill-activity'));
  await user.click(screen.getByTestId('fill-contact'));

  const notes = screen.getByPlaceholderText('추가로 공유하고 싶은 안전 정보나 특이사항을 입력하세요.');
  await user.type(notes, '테스트 메모');
};

describe('ReportForm', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('submits the form and shows success state', async () => {
    const mockResponse: ReportResponse = {
      id: '1',
      reportId: 'RPT-20250505-001',
      userId: 'user-1',
      status: 'APPROVED',
      safetyScore: 95,
      submittedAt: new Date().toISOString(),
      location: {
        name: '부산 해운대',
        coordinates: { latitude: 35.158, longitude: 129.16 },
      },
      activity: {
        type: '카약',
        startTime: '2025-05-05T09:00:00Z',
        endTime: '2025-05-05T11:00:00Z',
        participants: 4,
      },
      contact: {
        name: '홍길동',
        phone: '010-1234-5678',
        emergencyContact: '010-8765-4321',
      },
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const user = userEvent.setup();
    render(<ReportForm />);
    await fillRequiredFields(user);

    await user.click(screen.getByRole('button', { name: '신고 제출' }));

    await screen.findByText(/신고가 접수되었습니다/);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.method).toBe('POST');
    const payload = JSON.parse((init?.body ?? '{}') as string);
    expect(payload.location.name).toBe('부산 해운대');
    expect(payload.activity.participants).toBe(4);
    expect(payload.contact.phone).toBe('010-1234-5678');
  });

  it('shows error alert when API fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: '신고 실패' }),
    });

    const user = userEvent.setup();
    render(<ReportForm />);
    await fillRequiredFields(user);

    await user.click(screen.getByRole('button', { name: '신고 제출' }));

    await waitFor(() => {
      expect(screen.getByText(/제출에 실패했습니다/)).toBeInTheDocument();
    });
  });
});
