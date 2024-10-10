import {useGetTasksQuery, useUpdateTaskStatusMutation} from "@/state/api";
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/types/types';
import {EllipsisVertical, Plus} from "lucide-react";
import { format } from 'date-fns';
import Image from 'next/image';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatus = ['Todo', 'Work In Progress', 'Under Review', 'Completed'];

const Board = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An Error occurred while fetching task</div>
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  )
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length
  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };
  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className='mb-3 flex w-full'>
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{backgroundColor: statusColor[status]}}
        />
        <div className='flex w-full items-center justify-between rounded-e-lg bg-white py-4 px-5 dark:bg-dark-secondary'>
          <h3 className='flex items-center text-lg font-semibold dark:text-white'>
            {status}{' '}
            <span
              className='ml-2 inline-block rounded-[50%] bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary dark:text-white'
              style={{width: '1.5rem', height: '1.5rem'}}
            >
            {tasksCount}
          </span>
          </h3>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500'>
              <EllipsisVertical size={26}/>
            </button>
            <button className='flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white' onClick={() => setIsModalNewTaskOpen(true)}>
              <Plus size={16}/>
            </button>
          </div>
        </div>
      </div>
      {tasks.filter((task) => task.status === status).map((task) => (
        <Task key={task.id} task={task}/>
      ))}
    </div>
  );
}

type TaskProps = {
  task: TaskType;
}

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drop] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagSplit = task.tags ? task.tags.split(',') : [];
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';
  const formattedEndDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';
  const numberOfComments = (task.comments && task.comments.length) || 0;
  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  )

  return (
    <div ref={(instance) ={
      drag(instance)
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileUrl}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className='h-auto w-full rounded-t-md'
        />
      )}
      <div className='p-4 md:p-6'>
        <div className='flex items-start justify-between'>
          <div className=''></div>
        </div>
      </div>
    </div>
  )

}

export default Board;