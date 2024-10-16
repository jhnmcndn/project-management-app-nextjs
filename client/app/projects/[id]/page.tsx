'use client'

import {useState} from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '@/app/projects/Board';
import List from "@/app/projects/List";
import Timeline from "@/app/projects/Timeline";
import Table from "@/app/projects/Table";

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
      { activeTab === 'List' && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === 'Timeline' && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
       { activeTab === 'Table' && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
    </div>
  );
};

export default Project;