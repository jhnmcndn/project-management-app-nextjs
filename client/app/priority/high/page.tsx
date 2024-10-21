import React from 'react';
import ReusablePriorityPage from '@/app/priority/reusablePriorityPage';
import { Priority } from '@/types/enums';

const High = () => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default High;
