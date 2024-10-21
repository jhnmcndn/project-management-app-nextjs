import React from 'react';
import ReusablePriorityPage from '@/app/priority/reusablePriorityPage';
import { Priority } from '@/types/enums';

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default Urgent;
