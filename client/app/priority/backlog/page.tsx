import React from 'react';
import ReusablePriorityPage from '@/app/priority/reusablePriorityPage';
import { Priority } from '@/types/enums';

const Backlog = () => {
  return <ReusablePriorityPage priority={Priority.BackLog} />;
};

export default Backlog;
