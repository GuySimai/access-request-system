import { useState } from 'react';
import { TextField, Button, Heading, Text, Box, Flex, Icon } from '@vibe/core';
import { Key, Email } from '@vibe/icons';
import { useLogin } from '../../mutations/useLogin';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Flex
      direction={Flex.directions.COLUMN}
      align={Flex.align.CENTER}
      justify={Flex.justify.CENTER}
      className="min-h-screen from-gray-100 to-blue-50"
    >
      <Box
        padding={Box.paddings.XXL}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <Flex
          direction={Flex.directions.COLUMN}
          gap={Flex.gaps.LARGE}
          align={Flex.align.STRETCH}
        >
          <Flex
            direction={Flex.directions.COLUMN}
            align={Flex.align.CENTER}
            gap={Flex.gaps.SMALL}
          >
            <Box className="bg-blue-600 text-white rounded-full p-6 mb-6 shadow-lg">
              <Icon icon={Key} iconSize={48} />
            </Box>
            <Heading
              type={Heading.types.H1}
              align={Heading.align.CENTER}
              weight={Heading.weights.BOLD}
            >
              Welcome Back
            </Heading>
            <Text
              type={Text.types.TEXT1}
              align={Text.align.CENTER}
              color={Text.colors.SECONDARY}
            >
              Please sign in to continue to Access Request
            </Text>
          </Flex>

          <form onSubmit={handleSubmit} className="w-full">
            <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.MEDIUM}>
              <TextField
                title="Email"
                placeholder="name@company.com"
                value={email}
                onChange={setEmail}
                type={TextField.types.EMAIL}
                required
                iconName={Email}
                size={TextField.sizes.MEDIUM}
              />
              <TextField
                title="Password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                type={TextField.types.PASSWORD}
                required
                size={TextField.sizes.MEDIUM}
              />

              {error && (
                <Box
                  padding={Box.paddings.SMALL}
                  className="bg-red-50 rounded border border-red-200 text-center"
                >
                  <Text color={Text.colors.ERROR} type={Text.types.TEXT2}>
                    Login failed. Please try again.
                  </Text>
                </Box>
              )}

              <Button
                type="submit"
                kind={Button.kinds.PRIMARY}
                size={Button.sizes.LARGE}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </Flex>
          </form>
        </Flex>
      </Box>

      <Box marginTop={Box.margins.XL}>
        <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>
          © 2024 Access Request System
        </Text>
      </Box>
    </Flex>
  );
};
