import { useGetTasksQuery } from "@/state/api";
import Header from "@/app/components/Header";
import { Task } from "@/types/types";
import TaskCard from '@/app/components/TaskCard';

type taskProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const List = ({ id, setIsModalNewTaskOpen }: taskProps) => {
  const {
    data: tasks,
    error,
    isLoading
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An Error occurred while fetching task</div>

  return (
    <div className='px-4 pb-8 xl:px-6'>
      <div className='pt-5'>
        <Header
          name='List'
          buttonComponent={
            <button
              className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
        />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task}/>
        ))}
      </div>
    </div>
  );
};

export default List;