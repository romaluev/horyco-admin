'use client';

import { IBranch, useBranchStore } from '../model';
import BranchForm from './branch-form';
import { useEffect, useState } from 'react';
import BaseLoading from '@/components/base-loading';

type TBranchViewPageProps = {
  branchId: string;
};

export default function BranchViewPage({ branchId }: TBranchViewPageProps) {
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<IBranch | null>(null);

  // Get state and actions from the branch model
  const { getBranchById, error } = useBranchStore();

  let pageTitle = 'Create New Branch';

  useEffect(() => {
    const fetchBranch = async () => {
      setLoading(true);
      if (branchId === 'new') {
        setLoading(false);
        return;
      }

      try {
        // Fetch branch using the model action
        const data = await getBranchById(Number(branchId));
        if (data) {
          setBranch(data);
        }
      } catch (error) {
        console.error('Error fetching branch:', error);
        // Error handling is done in the model action
      }
      setLoading(false);
    };

    fetchBranch();
  }, [branchId, getBranchById]);

  if (error && branchId !== 'new') {
    return <div className='p-4 text-red-500'>Error: {error}</div>;
  }

  if (loading) {
    return <BaseLoading className='py-10' />;
  }

  if (branchId !== 'new' && !branch) {
    return <div className='p-4'>The branch doesn&#39;t exist</div>;
  }

  if (branchId !== 'new') {
    pageTitle = `Edit Branch: ${branch?.name}`;
  }

  return <BranchForm initialData={branch} pageTitle={pageTitle} />;
}
