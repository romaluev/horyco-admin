# API Module

This module provides a structured way to interact with the backend API. It includes:

- A custom Axios instance with interceptors for authentication
- Type definitions for API requests and responses
- Modules for different API domains (auth, branches, etc.)

## Structure

```
api/
├── index.ts           # Main exports and Axios instance
├── auth/              # Authentication API
│   ├── index.ts       # Auth API functions
│   └── types.ts       # Auth type definitions
└── branches/          # Branches API
    ├── index.ts       # Branch API functions
    └── types.ts       # Branch type definitions
```

## Usage

### Authentication

```typescript
import { authApi } from '@/api';

// Login
const login = async () => {
  try {
    const response = await authApi.login({
      phone: '1234567890',
      password: 'password123'
    });
    console.log('Logged in successfully', response);
  } catch (error) {
    console.error('Login failed', error);
  }
};

// Check if user is authenticated
const isLoggedIn = authApi.isAuthenticated();

// Logout
authApi.logout();
```

### Branches

```typescript
import { branchesApi } from '@/api';

// Get all branches
const getBranches = async () => {
  try {
    const response = await branchesApi.getBranches({
      page: 1,
      limit: 10
    });
    console.log('Branches:', response.data);
  } catch (error) {
    console.error('Failed to fetch branches', error);
  }
};

// Create a branch
const createBranch = async () => {
  try {
    const newBranch = await branchesApi.createBranch({
      name: 'New Branch',
      address: '123 Main St'
    });
    console.log('Branch created:', newBranch);
  } catch (error) {
    console.error('Failed to create branch', error);
  }
};

// Get a branch by ID
const getBranch = async (id: number) => {
  try {
    const branch = await branchesApi.getBranchById(id);
    console.log('Branch details:', branch);
  } catch (error) {
    console.error('Failed to fetch branch', error);
  }
};

// Update a branch
const updateBranch = async (id: number) => {
  try {
    const updatedBranch = await branchesApi.updateBranch(id, {
      name: 'Updated Branch Name'
    });
    console.log('Branch updated:', updatedBranch);
  } catch (error) {
    console.error('Failed to update branch', error);
  }
};

// Delete a branch
const deleteBranch = async (id: number) => {
  try {
    await branchesApi.deleteBranch(id);
    console.log('Branch deleted successfully');
  } catch (error) {
    console.error('Failed to delete branch', error);
  }
};
```

## Custom API Requests

If you need to make a custom API request that isn't covered by the provided functions, you can use the Axios instance directly:

```typescript
import api from '@/api';

const customRequest = async () => {
  try {
    const response = await api.get('/custom-endpoint');
    return response.data;
  } catch (error) {
    console.error('Custom request failed', error);
    throw error;
  }
};
```
