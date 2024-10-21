import React from 'react';
import ReusablePriorityPage from '@/app/priority/reusablePriorityPage';
import { Priority } from '@/types/enums';

const Medium = () => {
  return <ReusablePriorityPage priority={Priority.Medium} />;
};

export default Medium;
