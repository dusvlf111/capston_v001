import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import ActivitySelector from '../ActivitySelector';
import type { ReportSchema } from '@/lib/utils/validators';

type Overrides = Partial<ReportSchema['activity']>;

const buildDefaults = (overrides?: Overrides): ReportSchema => ({
  location: {
    name: '',
    coordinates: {
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number
    }
  },
  activity: {
    type: overrides?.type ?? '패들보드',
    startTime:
      overrides?.startTime ?? new Date('2025-05-05T09:00:00Z').toISOString(),
    endTime:
      overrides?.endTime ?? new Date('2025-05-05T10:30:00Z').toISOString(),
    participants: overrides?.participants ?? 2
  },
  contact: {
    name: '홍길동',
    phone: '010-0000-0000',
    emergencyContact: '010-1111-1111'
  },
  notes: ''
});

const renderSelector = (overrides?: Overrides) => {
  const defaults = buildDefaults(overrides);

  const Wrapper = () => {
    const methods = useForm<ReportSchema>({ defaultValues: defaults });
    return <ActivitySelector control={methods.control} />;
  };

  return render(<Wrapper />);
};

describe('ActivitySelector', () => {
  it('allows selecting activity types', async () => {
    const user = userEvent.setup();
    renderSelector();

    const kayakingButton = screen.getByTestId('activity-카약');
    await user.click(kayakingButton);

    expect(kayakingButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('validates time ordering', async () => {
    const user = userEvent.setup();
    renderSelector();

    const startInput = screen.getByTestId('activity-start');
    const endInput = screen.getByTestId('activity-end');

    await user.clear(startInput);
    await user.type(startInput, '2025-05-05T10:00');
    await screen.findByDisplayValue('2025-05-05T10:00');

    await user.clear(endInput);
    await user.type(endInput, '2025-05-05T09:00');

    const messages = await screen.findAllByText('종료 시간은 시작 시간 이후여야 합니다.');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('updates participants count', async () => {
    const user = userEvent.setup();
    renderSelector({ participants: 5 });

    const participantsInput = screen.getByTestId('activity-participants');
    fireEvent.input(participantsInput, { target: { value: '8' } });

    expect(participantsInput).toHaveValue(8);
  });
});
