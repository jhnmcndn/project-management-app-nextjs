'use client';

import { Priority } from '@/types/enums';
import { useState } from 'react';
import { useGetAuthUserQuery, useGetTasksByUserQuery } from '@/state/api';
import { useAppSelector } from '@/app/components/Providers/storeProvider';
import { Task } from '@/types/types';
import ModalNewTask from '@/app/components/Modal/ModalNewTask';
import Header from '@/app/components/Header';
import TaskCard from '@/app/components/TaskCard';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 100,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
        {params.value}
      </span>
    ),
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 75,
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 130,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    renderCell: (params) => params.value?.author || 'Unknown',
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    renderCell: (params) => params.value?.assignee || 'Unassigned',
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState<string>('list');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState<boolean>(false);

  const { data: currentUser } = useGetAuthUserQuery({});
  const userId = currentUser?.userDetails?.userId ?? null;
  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByUserQuery(userId || 0, { skip: userId === null });

  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByUserQuery(userId || 0, { skip: userId === null });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const filteredTasks = tasks?.filter((task: Task) => task.priority === priority);
  if (!tasksError || !tasks) return <div>Error fetching tasks</div>;
  
  return (
    <div className='m-5 p-4'>
      <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} />
      <Header
        name='Priority Page'
        buttonComponent={
          <button
            className='mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className='mb-4 flex justify-start'>
        <button
          className={`px-4 py-2 ${view === 'list' ? 'bg-gray-300' : 'bg-white'} rounded-l`}
          onClick={() => setView('list')}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${view === 'table' ? 'bg-gray-300' : 'bg-white'} rounded-l`}
          onClick={() => setView('table')}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === 'list' ? (
        <div className='gridcols1 grid gap-4'>
          {filteredTasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
        </div>
      ) : (
        view === 'table' &&
        filteredTasks && (
          <div className='w-full'>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
