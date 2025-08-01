// store/slices/serviceApiSlice.js

import { apiSlice } from './apiSlice';

const SERVICES_URL = '/services';

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: SERVICES_URL,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Service', id: _id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
      keepUnusedDataFor: 3600,
    }),
    getServiceById: builder.query({
      query: (serviceId) => ({
        url: `${SERVICES_URL}/${serviceId}`,
        method: 'GET',
      }),
       providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    
    // UPDATED: The backend route for creation is POST /api/services
    createService: builder.mutation({
      query: (serviceData) => ({
        url: SERVICES_URL, // The URL is just the base URL
        method: 'POST',
        body: serviceData, 
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),

    // This mutation is correct
    updateService: builder.mutation({
      query: ({ id, ...changes }) => ({
        url: `${SERVICES_URL}/${id}`,
        method: 'PUT',
        body: { changes }, // Ensure the payload matches the backend controller's expectation
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),

    // UPDATED: The backend route for deletion is DELETE /api/services/:id
    deleteService: builder.mutation({
      query: (serviceId) => ({ // Expects the document _id
        url: `${SERVICES_URL}/${serviceId}`, // Uses the ID in the URL
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice;