import axios from 'axios';

describe('Access Request (E2E)', () => {
  const TEST_USER_EMAIL = 'test-user@monday.com';
  const TEST_USER_PASSWORD = 'password123';

  let employeeToken: string;
  let employeeId: string;

  beforeAll(async () => {
    // Login as Employee (Test User)
    const empLogin = await axios.post('/api/auth/login', {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    employeeToken = empLogin.data.access_token;
    employeeId = empLogin.data.user.id;
  });

  describe('POST /api/access-requests', () => {
    it('should create a new access request', async () => {
      const res = await axios.post(
        '/api/access-requests',
        {
          subjectId: employeeId, // Self-request for testing purposes
          resource: 'Test Resource',
          reason: 'E2E Testing',
        },
        {
          headers: { Authorization: `Bearer ${employeeToken}` },
        }
      );

      expect(res.status).toBe(201);
    });
  });

  describe('GraphQL accessRequests', () => {
    it('should retrieve requests via GraphQL', async () => {
      const query = {
        query: `
          query {
            accessRequests {
              id
              resource
              status
            }
          }
        `,
      };

      const res = await axios.post('/graphql', query, {
        headers: { Authorization: `Bearer ${employeeToken}` },
      });

      expect(res.status).toBe(200);
      // Note: Regular employees can see their own requests
      expect(res.data.data.accessRequests).toBeDefined();
    });
  });
});
