import { Box, Flex, Heading, Text, Avatar, Button } from '@vibe/core';
import { useState } from 'react';
import { LogOut, Add } from '@vibe/icons';
import { useAccessRequests } from '../../queries/useAccessRequests';
import { useApproveRequest } from '../../mutations/useApproveRequest';
import { useAuth } from '../../providers/AuthProvider';
import { FiltersComponent } from './components/Filters';
import { RequestsTable } from './components/RequestsTable';
import { RequestAccessModal } from './components/RequestAccessModal';
import { REQUEST_STATUS } from '../../constants/access-request';
import { ITEMS_PER_PAGE } from './constants';
import type { RequestStatus } from '../../types/access-request';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState<RequestStatus | undefined>(
    undefined
  );
  const [requestorEmailInput, setRequestorEmailInput] = useState('');
  const [subjectEmailInput, setSubjectEmailInput] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    status: undefined as RequestStatus | undefined,
    requestorEmail: '',
    subjectEmail: '',
  });

  const { data: requests, isLoading } = useAccessRequests({
    status: appliedFilters.status,
    requestorEmail: appliedFilters.requestorEmail || undefined,
    subjectEmail: appliedFilters.subjectEmail || undefined,
    skip: page * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE + 1, // Fetch one extra to check for next page
  });

  const { mutate: handleDecision } = useApproveRequest();

  const handleApplyFilters = () => {
    setPage(0);
    setAppliedFilters({
      status: statusInput,
      requestorEmail: requestorEmailInput,
      subjectEmail: subjectEmailInput,
    });
  };

  const handleClearFilters = () => {
    setPage(0);
    setStatusInput(undefined);
    setRequestorEmailInput('');
    setSubjectEmailInput('');
    setAppliedFilters({
      status: undefined,
      requestorEmail: '',
      subjectEmail: '',
    });
  };

  const handleDecisionClick = (
    id: string,
    newStatus: typeof REQUEST_STATUS.APPROVED | typeof REQUEST_STATUS.DENIED
  ) => {
    handleDecision({ id, status: newStatus });
  };

  const hasNextPage = requests ? requests.length > ITEMS_PER_PAGE : false;
  const displayRequests = requests ? requests.slice(0, ITEMS_PER_PAGE) : [];

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  return (
    <Box className="min-h-screen bg-gray-50 p-6">
      <Flex
        justify={Flex.justify.SPACE_BETWEEN}
        align={Flex.align.CENTER}
        className="mb-8 select-none"
      >
        <Flex gap={Flex.gaps.SMALL} align={Flex.align.CENTER}>
          <img
            src="/access-general-house-key-svgrepo-com.svg"
            alt="Logo"
            className="w-8 h-8"
          />
          <Heading type={Heading.types.H2} weight={Heading.weights.BOLD}>
            Access Requests
          </Heading>
        </Flex>
        <Flex gap={Flex.gaps.MEDIUM} align={Flex.align.CENTER}>
          <Button
            onClick={() => setIsRequestModalOpen(true)}
            leftIcon={Add}
            size={Button.sizes.MEDIUM}
            className="rounded-full! bg-indigo-600! hover:bg-indigo-700! shadow-sm hover:shadow-md transition-all font-bold!"
          >
            Request Access
          </Button>
          <Flex
            gap={Flex.gaps.SMALL}
            align={Flex.align.CENTER}
            className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            <Avatar
              size={Avatar.sizes.SMALL}
              name={user?.name}
              type={Avatar.types.IMG}
            />
            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2} weight={Text.weights.BOLD}>
                {user?.name}
              </Text>
              <Text type={Text.types.TEXT3} color={Text.colors.SECONDARY}>
                {user?.email}
              </Text>
            </Flex>
          </Flex>
          <Button
            onClick={logout}
            kind={Button.kinds.TERTIARY}
            size={Button.sizes.MEDIUM}
            leftIcon={LogOut}
            className="hover:bg-red-50! text-red-500! rounded-full!"
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      <FiltersComponent
        status={statusInput}
        setStatus={setStatusInput}
        requestorEmail={requestorEmailInput}
        setRequestorEmail={setRequestorEmailInput}
        subjectEmail={subjectEmailInput}
        setSubjectEmail={setSubjectEmailInput}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        isLoading={isLoading}
      />

      <RequestsTable
        requests={displayRequests}
        isLoading={isLoading}
        userRole={user?.role}
        onDecision={handleDecisionClick}
        page={page}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        hasNextPage={hasNextPage}
      />

      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </Box>
  );
};
