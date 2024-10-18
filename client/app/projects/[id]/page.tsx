'use client';

import { useState } from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '@/app/projects/Board';
import List from '@/app/projects/List';
import TimelineView from '@/app/projects/TimelineView';
import Table from '@/app/projects/Table';
import ModalNewTask from '@/app/components/Modal/ModalNewTask';

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState<string>('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState<boolean>(false);

  return (
    <div>
      {/*Modal New Task*/}
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Board' && <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
      {activeTab === 'List' && <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
      {activeTab === 'Timeline' && (
        <TimelineView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === 'Table' && <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
    </div>
  );
};

export default Project;
