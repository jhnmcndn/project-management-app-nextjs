'use client';

import { useGetProjectsQuery, useGetTasksQuery } from '@/state/api';
import { useAppSelector } from '@/app/components/Providers/storeProvider';
import { Priority } from '@/types/enums';
import { Project, Task } from '@/types/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Header from '@/app/components/Header';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const taskColumns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'priority', headerName: 'Priority', width: 150 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt('1') });
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading...</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    const { priority } = task;
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {});

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce((acc: Record<string, number>, projects: Project) => {
    const status = projects.endDate ? 'Completed' : 'Active';
    acc[status] = (acc[status as Priority] || 0) + 1;
    return acc;
  }, {});

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8842'];
  const chartColors = isDarkMode
    ? {
        bar: '#884db',
        barGrid: '#303030',
        pieFill: '#4A90E2',
        text: '#ffffff',
      }
    : {
        bar: '#884db',
        barGrid: '#E0E0E0',
        pieFill: '#82CA9D',
        text: '#000000',
      };
  return (
    <div className='container h-full w-[100%] bg-gray-100 bg-transparent p-8'>
      <Header name='Project Management Dashboard' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='dark:bg-dark-secondary rounded-lg bg-white p-4 shadow'>
          <h3 className='mb-4 text-lg font-semibold dark:text-white'>Task Priority Distribution</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray='3 3' stroke={chartColors.barGrid} />
              <XAxis dataKey='name' stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: 'min-content',
                  height: 'min-content',
                }}
              />
              <Legend />
              <Bar dataKey='count' fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='dark:bg-dark-secondary rounded-lg bg-white p-4 shadow'>
          <h3 className='mb-4 text-lg font-semibold dark:text-white'>Project Status</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie dataKey='count' data={projectStatus} fill='#82ca9d' label>
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='dark:bg-dark-secondary rounded-lg bg-white p-4 shadow md:col-span-2'>
          <h3 className='mb-4 text-lg font-semibold dark:text-white'>YourTask</h3>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={tasks}
            columns={taskColumns}
            checkboxSelection
            loading={tasksLoading}
            getRowClassName={() => 'data-grid-row'}
            getCellClassName={() => 'data-grid-cell'}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
