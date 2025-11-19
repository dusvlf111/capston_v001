import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import LocationSelector from '../LocationSelector';
import type { ReportSchema } from '@/lib/utils/validators';

type RenderOverrides = {
  location?: Partial<ReportSchema['location']>;
};

const buildDefaults = (overrides?: RenderOverrides): ReportSchema => ({
  location: {
    name: overrides?.location?.name ?? '',
    coordinates: {
      latitude: overrides?.location?.coordinates?.latitude ?? (undefined as unknown as number),
      longitude: overrides?.location?.coordinates?.longitude ?? (undefined as unknown as number)
    }
  },
  activity: {
    type: '패들보드',
    startTime: new Date('2025-05-05T09:00:00Z').toISOString(),
    endTime: new Date('2025-05-05T10:00:00Z').toISOString(),
    participants: 1
  },
  contact: {
    name: '홍길동',
    phone: '010-0000-0000',
    emergencyContact: '010-1111-1111'
  },
  notes: ''
});

const renderWithForm = (overrides?: RenderOverrides) => {
  const defaults = buildDefaults(overrides);

  const Wrapper = () => {
    const methods = useForm<ReportSchema>({ defaultValues: defaults });
    return <LocationSelector control={methods.control} />;
  };

  return render(<Wrapper />);
};

describe('LocationSelector', () => {
  const getCurrentPositionMock = vi.fn();

  beforeEach(() => {
    getCurrentPositionMock.mockReset();
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: getCurrentPositionMock } as Partial<Geolocation>,
      configurable: true
    });
  });

  it('allows users to input location name', async () => {
    const user = userEvent.setup();
    renderWithForm();
    const input = screen.getByLabelText('활동 위치');
    await user.type(input, '부산 해운대');
    expect(input).toHaveValue('부산 해운대');
  });

  it('fills coordinates when geolocation succeeds', async () => {
    const user = userEvent.setup();
    getCurrentPositionMock.mockImplementationOnce((success: PositionCallback) => {
      success({
        coords: {
          latitude: 35.1587,
          longitude: 129.1604,
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: Date.now()
      } as GeolocationPosition);
    });

    renderWithForm();
    await user.click(screen.getByRole('button', { name: '현재 위치 사용' }));

    await waitFor(() => {
      expect(screen.getByLabelText('위도')).toHaveValue('35.158700');
      expect(screen.getByLabelText('경도')).toHaveValue('129.160400');
    });
  });

  it('shows an error when geolocation fails', async () => {
    const user = userEvent.setup();
    getCurrentPositionMock.mockImplementationOnce((success: PositionCallback, error: PositionErrorCallback) => {
      error({
        code: 1,
        message: 'denied',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError);
    });

    renderWithForm();
    await user.click(screen.getByRole('button', { name: '현재 위치 사용' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('위치 접근이 거부되었습니다');
  });

  it('renders coordinate preview when values exist', () => {
    renderWithForm({
      location: {
        name: '제주 협재해변',
        coordinates: {
          latitude: 33.3943 as unknown as number,
          longitude: 126.2396 as unknown as number
        }
      }
    });

    const preview = screen.getByTestId('map-preview');
    expect(preview).toHaveTextContent('33.394300');
    expect(preview).toHaveTextContent('126.239600');
  });
});
