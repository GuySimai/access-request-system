import React from 'react';
import { Flex, Box, TextField, Button, Dropdown } from '@vibe/core';
import { Search, Filter, Erase } from '@vibe/icons';
import { STATUS_OPTIONS } from './constants';
import type { FiltersProps } from './types';
import type { RequestStatus } from '../../../../types/access-request';

export const FiltersComponent: React.FC<FiltersProps> = ({
  status,
  setStatus,
  requestorEmail,
  setRequestorEmail,
  subjectEmail,
  setSubjectEmail,
  onApply,
  onClear,
  isLoading = false,
}) => {
  return (
    <Flex
      gap={Flex.gaps.SMALL}
      align={Flex.align.CENTER}
      className="mb-6 bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative z-30"
    >
      <Box className="flex-1">
        <TextField
          placeholder="Requestor email..."
          value={requestorEmail}
          onChange={setRequestorEmail}
          size={TextField.sizes.SMALL}
          iconName={Search}
        />
      </Box>
      <Box className="flex-1">
        <TextField
          placeholder="Subject email..."
          value={subjectEmail}
          onChange={setSubjectEmail}
          size={TextField.sizes.SMALL}
          iconName={Search}
        />
      </Box>
      <Box className="w-48">
        <Dropdown
          placeholder="All Statuses"
          options={STATUS_OPTIONS}
          value={STATUS_OPTIONS.find((opt) => opt.value === status)}
          onChange={(opt: { value: RequestStatus } | null) =>
            setStatus(opt ? opt.value : undefined)
          }
          size={Dropdown.sizes.SMALL}
          insideOverflowContainer
          menuPosition="fixed"
        />
      </Box>
      <Flex gap={Flex.gaps.XS}>
        <Button
          kind={Button.kinds.PRIMARY}
          size={Button.sizes.SMALL}
          leftIcon={Filter}
          onClick={onApply}
          loading={isLoading}
        >
          Filter
        </Button>
        <Button
          kind={Button.kinds.SECONDARY}
          size={Button.sizes.SMALL}
          onClick={onClear}
          leftIcon={Erase}
        >
          Clear
        </Button>
      </Flex>
    </Flex>
  );
};
