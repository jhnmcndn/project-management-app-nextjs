'use client'

import {useState} from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '@/app/projects/Board';

type Props = {
  params: { id: string };
}

const Project = ({params}: Props) => {
  const {id} = params;
  const [activeTab, setActiveTab] = useState<string>('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState<boolean>(false);


  return (
    <div>
      {/*Modal New Task*/}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      { activeTab === 'Board' && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
    </div>
  );
};

export default Project;