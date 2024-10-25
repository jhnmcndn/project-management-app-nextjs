import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project, SearchResults, Task, Team, User } from '@/types/types';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Projects', 'Tasks', 'Users', 'Teams'],
  endpoints: (build) => ({
    getAuthUser: build.query({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if (!session) throw new Error('No session found');
          const { userSub } = session;
          const { accessToken } = session.tokens ?? {};

          const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
          const userDetails = userDetailsResponse.data as User;

          return { data: { user, userSub, userDetails } };
        } catch (error: any) {
          return { error: error.message || 'Could not fetch user data' };
        }
      },
    }),
    getProjects: build.query<Project[], void>({
      query: () => 'projects',
      providesTags: ['Projects'],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Projects'],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Tasks' as const, id }))
          : [{ type: 'Tasks' as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result ? result.map(({ id }) => ({ type: 'Tasks', id })) : [{ type: 'Tasks', id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: 'Tasks', id: taskId }],
    }),
    getUsers: build.query<User[], void>({
      query: () => 'users',
      providesTags: ['Users'],
    }),
    getTeams: build.query<Team[], void>({
      query: () => 'teams',
      providesTags: ['Teams'],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
} = api;
