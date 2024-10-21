import React from 'react';
import ReusablePriorityPage from '@/app/priority/reusablePriorityPage';
import { Priority } from '@/types/enums';

const Low = () => {
  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default Low;
