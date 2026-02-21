import axios, { AxiosError } from 'axios';

describe('Auth (E2E)', () => {
  const TEST_USER_EMAIL = 'test-user@monday.com';
  const TEST_USER_PASSWORD = 'password123';

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await axios.post('/api/auth/login', {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('access_token');
      expect(res.data.user.email).toBe(TEST_USER_EMAIL);
    });

    it('should fail to login with invalid credentials', async () => {
      try {
        await axios.post('/api/auth/login', {
          email: TEST_USER_EMAIL,
          password: 'wrongpassword',
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        expect(axiosError.response?.status).toBe(401);
        expect(axiosError.response?.data?.message).toBe(
          'Invalid email or password'
        );
      }
    });
  });
});
