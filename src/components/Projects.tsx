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
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { Project, Skill } from "@prisma/client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectWithSkills = Project & {
  skills?: Skill[];
};

interface projectsProps {
  projects: ProjectWithSkills[];
  skills: Skill[];
}

const Projects = ({ projects, skills }: projectsProps) => {
  const router = useRouter();

  // Handle New Modal Change
  const {
    isOpen: isNewModalOpen,
    onOpen: onNewModalOpen,
    onOpenChange: onNewModalChange,
  } = useDisclosure();

  // Handle Edit Modal Change
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalChange,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const projectImgRef = useRef<HTMLInputElement>(null);
  const [projectImgPreview, setProjectImgPreview] = useState<string>("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [skillSet, setSkillSet] = useState<string>("");
  const [editSkillSet, setEditSkillSet] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithSkills | null>(null);
  console.log("selectedProject", selectedProject);

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

  const handleEditSkillChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditSkillSet(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  // Handle project submit
  const handleNewProjectSubmit = async (
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

  // Handle edit project submit
  const handleEditProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (projectImage) formData.append("projectImage", projectImage);
    formData.append("skillSet", JSON.stringify(editSkillSet));
    if (selectedProject?.id) {
      formData.append("id", selectedProject.id);
    }

    try {
      const response = await fetch("/api/settings/project", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Project updated successfully.");
        form.reset();
        setProjectImage(null);
        setProjectImgPreview("");
        setTimeout(() => {
          setSuccess(null);
          router.refresh();
          onEditModalChange();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setError("Unable to update. Please try after sometime");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <Button href="#" size="sm" onPress={onNewModalOpen}>
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
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    setSelectedProject(project);
                    setEditSkillSet(
                      project.skills?.map((skill) => skill.id) || []
                    );
                    onEditModalOpen();
                  }}
                  className="cursor-pointer"
                >
                  <BsPencilSquare className="w-5 h-5" />
                </Button>
                <Button isIconOnly variant="light" className="cursor-pointer">
                  <BsTrash className="w-5 h-5 text-danger" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isNewModalOpen} onOpenChange={onNewModalChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Project
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={handleNewProjectSubmit}>
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

      {/* Edit Model */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Project
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={handleEditProjectSubmit}>
                  <Input
                    label="Project Title"
                    name="project-title"
                    labelPlacement="outside"
                    placeholder="Enter project title"
                    defaultValue={selectedProject?.title || ""}
                    isRequired
                  />
                  <Input
                    label="Project Link/URL"
                    name="project-link"
                    labelPlacement="outside"
                    placeholder="Enter project title"
                    defaultValue={selectedProject?.link || ""}
                    isRequired
                  />
                  <Textarea
                    label="Project Summary"
                    name="project-summary"
                    labelPlacement="outside"
                    placeholder="Enter project summary"
                    defaultValue={selectedProject?.summary || ""}
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
                    selectedKeys={editSkillSet}
                    onChange={handleEditSkillChange}
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
                    {projectImgPreview !== "" ? (
                      <Image src={projectImgPreview} width={200} />
                    ) : selectedProject?.image ? (
                      <Image src={selectedProject.image} width={200} />
                    ) : null}
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
                      Update Project
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
