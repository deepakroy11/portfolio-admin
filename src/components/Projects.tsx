"use client";

import {
  Button,
  Link,
  Form,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Select,
  SelectItem,
  Alert,
  Avatar,
  Chip,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { BsPencilSquare } from "react-icons/bs";
import type { Project, Skill } from "@prisma/client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface projectsProps {
  projects: Project[];
  skills: Skill[];
}

const Projects = ({ projects, skills }: projectsProps) => {
  const router = useRouter();

  // Handle Modal
  const {
    isOpen: isProjectModalOpen,
    onOpen: onProjectModalOpen,
    onOpenChange: onProjectMOdalChange,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const projectImgRef = useRef<HTMLInputElement>(null);
  const [projectImgPreview, setProjectImgPreview] = useState<string>("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [skillSet, setSkillSet] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file change
  const triggerFileChange = () => {
    console.log("File Changed");
    projectImgRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProjectImage(file);
      setProjectImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSkillChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSkillSet(event.target.value);
  };

  // Handle project submit
  const handleProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (projectImage) formData.append("projectImage", projectImage);
    formData.append("skillSet", skillSet);

    console.log(formData);
    try {
      const response = await fetch("/api/settings/project", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Project saved successfully.");

        form.reset();
        setProjectImage(null);
        setProjectImgPreview("");
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Unable to save. Please try after sometime");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <Button href="#" size="sm" onPress={onProjectModalOpen}>
          New Project
        </Button>
      </div>
      <Table isVirtualized maxTableHeight={400} rowHeight={50}>
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Summary</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.summary}</TableCell>
              <TableCell>
                <Image
                  src={project.image}
                  alt={project.title}
                  className="w-24 h-12 object-cover"
                />
              </TableCell>

              <TableCell>
                <Link
                  href="#"
                  onPress={onProjectModalOpen}
                  className="cursor-pointer"
                >
                  <BsPencilSquare className="w-5 h-5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isProjectModalOpen}
        onOpenChange={onProjectMOdalChange}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Project
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={handleProjectSubmit}>
                  <Input
                    label="Project Title"
                    name="project-title"
                    labelPlacement="outside"
                    placeholder="Enter project title"
                    isRequired
                  />
                  <Input
                    label="Project Link/URL"
                    name="project-link"
                    labelPlacement="outside"
                    placeholder="Enter project title"
                    isRequired
                  />
                  <Textarea
                    label="Project Summary"
                    name="project-summary"
                    labelPlacement="outside"
                    placeholder="Enter project summary"
                    isRequired
                  />
                  <Select
                    name="skills"
                    items={skills}
                    label="Tag Skills"
                    labelPlacement="outside"
                    placeholder="Select skills"
                    selectionMode="multiple"
                    isMultiline={true}
                    onChange={handleSkillChange}
                    renderValue={(items) => (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) =>
                          item.data ? (
                            <Chip key={item.key}>{item.data.title}</Chip>
                          ) : null
                        )}
                      </div>
                    )}
                  >
                    {(skill) => (
                      <SelectItem key={skill.id} textValue={skill.title}>
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={skill.title}
                            className="flex-shrink-0"
                            size="sm"
                            src={skill.image}
                            showFallback
                          />

                          <div className="flex flex-col">
                            <span className="text-small">{skill.title}</span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>

                  <div className="w-full flex justify-start items-center bg-primary-100 rounded-2xl p-4 space-x-4">
                    <Button onPress={triggerFileChange}>
                      Upload Project Screenshot
                    </Button>
                    {projectImgPreview != "" && (
                      <Image src={projectImgPreview} width={200} />
                    )}
                    <Input
                      type="file"
                      name="project-img"
                      ref={projectImgRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  {success && (
                    <Alert color="success" variant="faded" title={success} />
                  )}

                  {error && (
                    <Alert color="danger" variant="faded" title={error} />
                  )}

                  <div className="w-full flex justify-end space-x-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={isLoading}>
                      Save Project
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Projects;
