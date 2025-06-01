'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest
} from '@/api/branches/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useBranchesStore } from '../store/branches-store';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Branch name must be at least 2 characters.'
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.'
  })
});

export default function BranchForm({
  initialData,
  pageTitle
}: {
  initialData: Branch | null;
  pageTitle: string;
}) {
  const router = useRouter();

  // Get actions and loading state from the branches store
  const { createBranch, updateBranch, isLoading } = useBranchesStore();

  // Set default values based on initialData
  const defaultValues = {
    name: initialData?.name || '',
    address: initialData?.address || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        // Update existing branch using the store action
        const result = await updateBranch(
          initialData.id,
          values as UpdateBranchRequest
        );
        if (result) {
          router.push('/dashboard/branches');
        }
      } else {
        const result = await createBranch(values as CreateBranchRequest);
        if (result) {
          router.push('/dashboard/branches');
        }
      }
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter branch name'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter branch address'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {initialData ? 'Update Branch' : 'Create Branch'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
