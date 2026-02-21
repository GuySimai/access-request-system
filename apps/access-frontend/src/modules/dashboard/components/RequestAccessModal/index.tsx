import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  TextField,
  Flex,
  Box,
  Heading,
  Text,
} from '@vibe/core';
import { useCreateAccessRequest } from '../../../../mutations/useCreateAccessRequest';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestAccessModal: React.FC<RequestAccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [subjectEmail, setSubjectEmail] = useState('');
  const [resource, setResource] = useState('');
  const [reason, setReason] = useState('');

  const resetForm = () => {
    setSubjectEmail('');
    setResource('');
    setReason('');
  };

  const { mutate: createRequest, isPending } = useCreateAccessRequest();

  const handleSubmit = () => {
    if (!subjectEmail || !resource || !reason) return;

    createRequest(
      { subjectEmail, resource, reason },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      id="request-access-modal"
      show={isOpen}
      onClose={handleClose}
      title="Request Access"
      width={Modal.width.MEDIUM}
    >
      <ModalHeader
        title={
          <Flex
            direction={Flex.directions.COLUMN}
            align={Flex.align.START}
            gap={Flex.gaps.XS}
          >
            <Heading type={Heading.types.H3} weight={Heading.weights.BOLD}>
              Request New Access
            </Heading>
            <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
              Fill in the details below to request access to a resource.
            </Text>
          </Flex>
        }
      />
      <ModalContent>
        <Box className="py-4">
          <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}>
            <Box className="w-full">
              <TextField
                title="Subject Email"
                placeholder="e.g. user@company.com"
                value={subjectEmail}
                onChange={setSubjectEmail}
                required
                size={TextField.sizes.MEDIUM}
              />
            </Box>
            <Box className="w-full">
              <TextField
                title="Resource Name"
                placeholder="e.g. Production Database, AWS S3 Bucket"
                value={resource}
                onChange={setResource}
                required
                size={TextField.sizes.MEDIUM}
              />
            </Box>
            <Box className="w-full">
              <TextField
                title="Justification / Reason"
                placeholder="Why do you need this access?"
                value={reason}
                onChange={setReason}
                required
                size={TextField.sizes.MEDIUM}
              />
            </Box>
          </Flex>
        </Box>
      </ModalContent>
      <ModalFooter>
        <Flex
          justify={Flex.justify.END}
          gap={Flex.gaps.SMALL}
          className="w-full"
        >
          <Button kind={Button.kinds.TERTIARY} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={
              !subjectEmail ||
              !resource ||
              !reason ||
              !subjectEmail.includes('@')
            }
          >
            Send Request
          </Button>
        </Flex>
      </ModalFooter>
    </Modal>
  );
};
