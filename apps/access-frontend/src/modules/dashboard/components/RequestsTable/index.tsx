import React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  Flex,
  Text,
  Avatar,
  Label,
  Icon,
} from '@vibe/core';
import {
  ClassicFolder,
  NavigationChevronLeft,
  NavigationChevronRight,
} from '@vibe/icons';
import { getStatusColor, getConfidenceColor, formatDate } from './utils';
import { REQUEST_STATUS, USER_ROLE } from '../../../../constants/access-request';
import { TABLE_COLUMNS } from './constants';
import type { RequestsTableProps } from './types';
import { AccessRequest } from '../../../../types/access-request';

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  isLoading,
  userRole,
  onDecision,
  page,
  onNextPage,
  onPrevPage,
  hasNextPage,
}) => {
  return (
    <Box className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto relative z-0">
      <Table
        className="z-[9999]!important"
        columns={TABLE_COLUMNS}
        emptyState={
          <Flex
            direction={Flex.directions.COLUMN}
            align={Flex.align.CENTER}
            className="py-50"
            gap={Flex.gaps.SMALL}
          >
            <Icon
              icon={ClassicFolder}
              iconSize={40}
              color={Text.colors.SECONDARY}
            />
            <Text type={Text.types.TEXT1} color={Text.colors.SECONDARY}>
              No requests found
            </Text>
          </Flex>
        }
      >
        <TableHeader>
          {TABLE_COLUMNS.map((column) => (
            <TableHeaderCell key={column.id} title={column.title} />
          ))}
        </TableHeader>
        <TableBody>
          {Array.isArray(requests) &&
            requests.map((request: AccessRequest) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Flex gap={Flex.gaps.SMALL} align={Flex.align.CENTER}>
                    <Avatar
                      size={Avatar.sizes.SMALL}
                      name={request.requestor.name}
                      type={Avatar.types.IMG}
                    />
                    <Flex
                      direction={Flex.directions.COLUMN}
                      align={Flex.align.START}
                    >
                      <Text
                        type={Text.types.TEXT2}
                        weight={Text.weights.MEDIUM}
                      >
                        {request.requestor.name}
                      </Text>
                      <Text
                        type={Text.types.TEXT3}
                        color={Text.colors.SECONDARY}
                      >
                        {request.requestor.email}
                      </Text>
                    </Flex>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Flex gap={Flex.gaps.SMALL} align={Flex.align.CENTER}>
                    <Avatar
                      size={Avatar.sizes.SMALL}
                      name={request.subject.name}
                      type={Avatar.types.IMG}
                      backgroundColor={Avatar.colors.DARK_BLUE}
                    />
                    <Flex
                      direction={Flex.directions.COLUMN}
                      align={Flex.align.START}
                    >
                      <Text type={Text.types.TEXT2}>
                        {request.subject.name}
                      </Text>
                      <Text
                        type={Text.types.TEXT3}
                        color={Text.colors.SECONDARY}
                      >
                        {request.subject.email}
                      </Text>
                    </Flex>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Text
                    type={Text.types.TEXT2}
                    weight={Text.weights.MEDIUM}
                    tooltipProps={{ zIndex: 100000 }}
                  >
                    {request.resource}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text
                    type={Text.types.TEXT2}
                    className="truncate max-w-[380px] block"
                    title={request.reason}
                    tooltipProps={{ zIndex: 100000 }}
                  >
                    {request.reason}
                  </Text>
                </TableCell>
                <TableCell>
                  {request.aiEvaluation ? (
                    <Flex gap={Flex.gaps.XS} align={Flex.align.CENTER}>
                      <Label
                        text={`${Math.round(
                          request.aiEvaluation.confidenceScore * 100
                        )}%`}
                        color={getConfidenceColor(
                          request.aiEvaluation.confidenceScore
                        )}
                        kind={Label.kinds.FILL}
                        className="w-16 flex justify-center"
                      />
                      <Text
                        type={Text.types.TEXT2}
                        weight={Text.weights.MEDIUM}
                      >
                        {request.aiEvaluation.recommendation === 'APPROVE'
                          ? 'Recommended'
                          : 'Not Recommended'}
                      </Text>
                    </Flex>
                  ) : (
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                      —
                    </Text>
                  )}
                </TableCell>
                <TableCell>
                  {request.aiEvaluation ? (
                    <Text
                      type={Text.types.TEXT2}
                      className="truncate max-w-[380px] block"
                      title={request.aiEvaluation.reasoning}
                      tooltipProps={{ zIndex: 100000 }}
                    >
                      {request.aiEvaluation.reasoning}
                    </Text>
                  ) : (
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                      —
                    </Text>
                  )}
                </TableCell>
                <TableCell>
                  <Label
                    text={request.status}
                    color={getStatusColor(request.status)}
                    kind={Label.kinds.LINE}
                  />
                </TableCell>
                <TableCell>
                  {request.decidedBy ? (
                    <Flex gap={Flex.gaps.SMALL} align={Flex.align.CENTER}>
                      <Avatar
                        size={Avatar.sizes.SMALL}
                        name={request.decidedBy.name}
                        type={Avatar.types.IMG}
                      />
                      <Flex
                        direction={Flex.directions.COLUMN}
                        align={Flex.align.START}
                      >
                        <Text type={Text.types.TEXT2}>
                          {request.decidedBy.name}
                        </Text>
                        <Text
                          type={Text.types.TEXT3}
                          color={Text.colors.SECONDARY}
                        >
                          {request.decidedBy.email}
                        </Text>
                      </Flex>
                    </Flex>
                  ) : (
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                      —
                    </Text>
                  )}
                </TableCell>
                <TableCell>
                  {request.decisionAt ? (
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                      {formatDate(request.decisionAt)}
                    </Text>
                  ) : (
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                      —
                    </Text>
                  )}
                </TableCell>
                <TableCell>
                  <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
                    {formatDate(request.createdAt)}
                  </Text>
                </TableCell>
                <TableCell>
                  {userRole === USER_ROLE.APPROVER &&
                  request.status === REQUEST_STATUS.PENDING ? (
                    <Flex gap={Flex.gaps.XS} justify={Flex.justify.END}>
                      <Button
                        size={Button.sizes.SMALL}
                        kind={Button.kinds.PRIMARY}
                        onClick={() =>
                          onDecision(request.id, REQUEST_STATUS.APPROVED)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size={Button.sizes.SMALL}
                        kind={Button.kinds.TERTIARY}
                        color={Button.colors.NEGATIVE}
                        onClick={() =>
                          onDecision(request.id, REQUEST_STATUS.DENIED)
                        }
                      >
                        Deny
                      </Button>
                    </Flex>
                  ) : (
                    <Flex justify={Flex.justify.END} className="pr-4">
                      <Text
                        type={Text.types.TEXT2}
                        color={Text.colors.SECONDARY}
                      >
                        —
                      </Text>
                    </Flex>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Flex
        justify={Flex.justify.CENTER}
        align={Flex.align.CENTER}
        className="py-4 border-t border-gray-100 bg-gray-50/50"
        gap={Flex.gaps.MEDIUM}
      >
        <Button
          kind={Button.kinds.TERTIARY}
          size={Button.sizes.SMALL}
          leftIcon={NavigationChevronLeft}
          onClick={onPrevPage}
          disabled={page === 0 || isLoading}
        >
          Previous
        </Button>
        <Box className="bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
          <Text type={Text.types.TEXT2} weight={Text.weights.BOLD}>
            Page {page + 1}
          </Text>
        </Box>
        <Button
          kind={Button.kinds.TERTIARY}
          size={Button.sizes.SMALL}
          rightIcon={NavigationChevronRight}
          onClick={onNextPage}
          disabled={!hasNextPage || isLoading}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};
