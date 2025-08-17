"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import BasicDetails from "@/components/BasicDetails";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import type {
  BasicDetails as BasicDetailsType,
  Project,
  Skill,
} from "@prisma/client";

type ProjectWithSkills = Project & {
  skills?: Skill[];
};

interface SettingsTabsProps {
  basicDetails: BasicDetailsType | null;
  projects: ProjectWithSkills[];
  skills: Skill[];
  fallbackDetails: BasicDetailsType;
}

export default function SettingsTabs({
  basicDetails,
  projects,
  skills,
  fallbackDetails,
}: SettingsTabsProps) {
  return (
    <Tabs aria-label="Portfolio settings tabs" color="primary" radius="lg">
      <Tab key="basic-details" title="Basic Details">
        <BasicDetails details={basicDetails ?? fallbackDetails} />
      </Tab>

      <Tab key="skills" title="Skills">
        <Skills skills={skills} />
      </Tab>

      <Tab key="projects" title="Projects">
        <Projects projects={projects} skills={skills} />
      </Tab>
    </Tabs>
  );
}
