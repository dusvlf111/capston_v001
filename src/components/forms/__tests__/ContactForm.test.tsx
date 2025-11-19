import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';
import ContactForm from '../ContactForm';
import type { ReportSchema } from '@/lib/utils/validators';
import type { Database } from '@/types/database.types';

const mockUseAuth = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const buildReportDefaults = (overrides?: Partial<ReportSchema['contact']>): ReportSchema => ({
  location: {
    name: '',
    coordinates: {
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    },
  },
  activity: {
    type: '패들보드',
    startTime: new Date('2025-05-05T09:00:00Z').toISOString(),
    endTime: new Date('2025-05-05T10:30:00Z').toISOString(),
    participants: 2,
  },
  contact: {
    name: overrides?.name ?? '',
    phone: overrides?.phone ?? '010-0000-0000',
    emergencyContact: overrides?.emergencyContact ?? '010-1111-1111',
  },
  notes: '',
});

const renderContactForm = (overrides?: Partial<ReportSchema['contact']>) => {
  const defaults = buildReportDefaults(overrides);

  const Wrapper = () => {
    const methods = useForm<ReportSchema>({ defaultValues: defaults });
    return <ContactForm control={methods.control} />;
  };

  return render(<Wrapper />);
};

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

const mockProfile = (profile?: Partial<ProfileRow> | null) => {
  const baseProfile: ProfileRow = {
    id: 'profile-1',
    user_id: 'user-1',
    full_name: '홍길동',
    phone: '010-2222-3333',
    emergency_contact: '010-4444-5555',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const resolvedProfile = profile === null ? null : { ...baseProfile, ...(profile ?? {}) };

  mockUseAuth.mockReturnValue({
    user: null,
    profile: resolvedProfile,
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  });
};

describe('ContactForm', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    mockProfile();
  });

  it('updates contact inputs when the user types', async () => {
    mockProfile(null);
    const user = userEvent.setup();
    renderContactForm();

    const nameInput = screen.getByLabelText('신고자 이름');
    await user.clear(nameInput);
    await user.type(nameInput, '이순신');

    expect(nameInput).toHaveValue('이순신');
  });

  it('prefills contact fields when profile data is available', async () => {
    renderContactForm({ name: '', phone: '', emergencyContact: '' });

    expect(await screen.findByDisplayValue('홍길동')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-2222-3333')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-4444-5555')).toBeInTheDocument();
  });

  it('applies profile data again when the user clicks the fill button', async () => {
    renderContactForm({ name: '기존 이름', phone: '010-9999-9999', emergencyContact: '010-8888-8888' });
    const user = userEvent.setup();

    const applyButton = screen.getByTestId('apply-profile-contact');
    await user.click(applyButton);

    expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-2222-3333')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-4444-5555')).toBeInTheDocument();
  });
});
