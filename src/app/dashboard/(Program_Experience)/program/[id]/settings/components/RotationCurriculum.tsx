/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useState, useMemo } from 'react';

import CourseTable from './TableCourse';
import RotationList from './ListRotation';
import SetupRotation from './SetupRotation';
import { Button } from '@/components/ui/button';
import CourseConfigure from './ConfigureCourse';

import { programCards } from '@/data/programCards';

type CurriculumRotationProps = {
  isConfiguring: boolean;
  currentSelection: number;
  isSettingUpRotation: boolean;
  isSettingUpEvaluationForms: boolean;
  setIsConfiguring: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingUpRotation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingUpEvaluationForms: React.Dispatch<React.SetStateAction<boolean>>;
};

const CurriculumRotation = ({
  isConfiguring,
  currentSelection,
  setIsConfiguring,
  isSettingUpRotation,
  setIsSettingUpRotation,
  isSettingUpEvaluationForms,
  setIsSettingUpEvaluationForms,
}: CurriculumRotationProps) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentCourse, setCurrentCouse] = useState<number>(0);

  const selectedData = useMemo(() => {
    if (programCards) {
      return programCards?.[currentSelection];
    }

    return null;
  }, [currentSelection]);

  const renderHeaderButtons = () => {
    return (
      <>
        {['ACADEMIC COURSE', 'ROTATION'].map((label, index) => (
          <Button
            key={label}
            onClick={() => setCurrentTab(index)}
            className={`text-[#333333DE] cursor-pointer hover:bg-[#3C4DBD] hover:text-white px-3 py-1 rounded-[10px] font-medium border border-[#E0E0E0] ${
              currentTab === index ? 'bg-[#3C4DBD] text-white' : 'bg-white'
            }`}
          >
            {label}
          </Button>
        ))}
      </>
    );
  };

  const renderCourses = () => {
    return selectedData?.content?.map((item, index) => (
      <Button
        key={index}
        onClick={() => setCurrentCouse(index)}
        className={`text-[#333333DE] cursor-pointer hover:bg-[#3C4DBD] hover:text-white px-3 py-1 rounded-[10px] font-medium border border-[#E0E0E0] ${
          currentCourse === index ? 'bg-[#3C4DBD] text-white' : 'bg-white'
        }`}
      >
        {item.name}
      </Button>
    ));
  };

  if (isConfiguring) {
    return (
      <CourseConfigure
        setIsConfiguring={setIsConfiguring}
        isSettingUpEvaluationForms={isSettingUpEvaluationForms}
        setIsSettingUpEvaluationForms={setIsSettingUpEvaluationForms}
      />
    );
  }

  if (isSettingUpRotation) {
    return <SetupRotation setIsSettingUpRotation={setIsSettingUpRotation} />;
  }

  console.log('selectedData', selectedData);

  return (
    <div className="w-full">
      <h4 className="text-[12px] text-[#4f4f4f] font-medium mb-4">CURRICULUM & ROTATION</h4>

      <div className="mb-7 p-[2px] rounded-[20px] bg-gradient-to-r from-[rgba(210,210,255,0.4)] to-[rgba(221,153,246,0.4)] w-full">
        <div className="flex flex-col items-start justify-between h-[143px] w-full bg-gradient-to-r from-white to-[#e6e4ff] rounded-[20px] px-5 py-4">
          <p className="text-[#333333DE] text-[24px] font-semibold mb-2">{selectedData?.year}</p>

          <div className="items-center flex gap-2">
            {selectedData?.content.map((item, index) => <Button className='bg-white rounded-[10px] p-0 w-[43px] h-[30px] border border-[#D9D9D9] text-[#000000] text-[14px]' key={item.name}>{item.name}</Button>)}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">{renderHeaderButtons()}</div>

          {/* {currentTab === 0 && <div className="flex items-center gap-2">{renderCourses()}</div>}
          {currentTab === 1 && <div className="flex items-center gap-2">{renderCourses()}</div>} */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {currentTab === 0 && <CourseTable setIsConfiguring={setIsConfiguring} />}
        {currentTab === 1 && <RotationList setIsSettingUpRotation={setIsSettingUpRotation} />}
      </div>
    </div>
  );
};

export default CurriculumRotation;
