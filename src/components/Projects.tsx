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
  Pagination,
  Spinner,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { Project, Skill } from "@prisma/client";
import React, { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type ProjectWithSkills = Project & {
  skills?: Skill[];
};

interface projectsProps {
  projects: ProjectWithSkills[];
  skills: Skill[];
  isLoading?: boolean;
}

const Projects = ({ projects, skills, isLoading: contentLoading = false }: projectsProps) => {
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

  // Handle Delete Modal Change
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectImgRef = useRef<HTMLInputElement>(null);
  const [projectImgPreview, setProjectImgPreview] = useState<string>("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [skillSet, setSkillSet] = useState<string>("");
  const [editSkillSet, setEditSkillSet] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithSkills | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(projects.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return projects.slice(start, end);
  }, [page, projects]);

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

  const handleEditSkillChange = (keys: any) => {
    setEditSkillSet(Array.from(keys));
  };

  // Handle project submit
  const handleNewProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  // Handle edit project submit
  const handleEditProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    onDeleteModalOpen();
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    setIsSubmitting(true);
    setDeletingProjectId(projectToDelete);

    try {
      const response = await fetch(`/api/settings/project?id=${projectToDelete}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess("Project deleted successfully.");
        setTimeout(() => {
          setSuccess(null);
          router.refresh();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete project");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }

      setError("Unable to delete. Please try after sometime");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
      setDeletingProjectId(null);
      onDeleteModalChange();
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl">Projects</h2>
        <Button href="#" size="sm" onPress={onNewModalOpen} className="w-full sm:w-auto">
          New Project
        </Button>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {contentLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          projects.map((project, index) => (
          <div key={project.id} className="bg-content1 rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-default-500">#{index + 1}</span>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setSelectedProject(project);
                    setEditSkillSet(
                      project.skills?.map((skill) => skill.id) || []
                    );
                    onEditModalOpen();
                  }}
                >
                  <BsPencilSquare className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => confirmDelete(project.id)}
                  isLoading={deletingProjectId === project.id}
                >
                  {deletingProjectId === project.id ? <Spinner size="sm" /> : <BsTrash className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Image
                src={project.image}
                alt={project.title}
                className="w-16 h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{project.title}</h3>
                <p className="text-xs text-default-500 mt-1 line-clamp-2">{project.summary}</p>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        {contentLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
        <Table 
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>SL</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Summary</TableColumn>
            <TableColumn>Image</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-32 truncate">{project.title}</TableCell>
                <TableCell className="max-w-48 truncate">{project.summary}</TableCell>
                <TableCell>
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="w-20 h-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setSelectedProject(project);
                        setEditSkillSet(
                          project.skills?.map((skill) => skill.id) || []
                        );
                        onEditModalOpen();
                      }}
                    >
                      <BsPencilSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => confirmDelete(project.id)}
                      isLoading={deletingProjectId === project.id}
                    >
                      {deletingProjectId === project.id ? <Spinner size="sm" /> : <BsTrash className="w-4 h-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>
      <Modal 
        isOpen={isNewModalOpen} 
        onOpenChange={onNewModalChange} 
        size="2xl" 
        scrollBehavior="inside" 
        className="mx-2"
        classNames={{
          base: "max-h-[90vh]",
          body: "p-4 sm:p-6"
        }}
      >
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

                  <div className="w-full flex flex-col sm:flex-row justify-start items-center bg-primary-100 rounded-2xl p-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button onPress={triggerFileChange} size="sm" className="w-full sm:w-auto">
                      Upload Screenshot
                    </Button>
                    {projectImgPreview != "" && (
                      <Image src={projectImgPreview} className="w-full sm:w-48 max-w-48" />
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

                  <div className="w-full flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button color="danger" variant="light" onPress={onClose} className="w-full sm:w-auto">
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={isSubmitting} className="w-full sm:w-auto">
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
        scrollBehavior="inside"
        className="mx-2"
        classNames={{
          base: "max-h-[90vh]",
          body: "p-4 sm:p-6"
        }}
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
                    selectedKeys={new Set(editSkillSet)}
                    onSelectionChange={handleEditSkillChange}
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

                  <div className="w-full flex flex-col sm:flex-row justify-start items-center bg-primary-100 rounded-2xl p-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button onPress={triggerFileChange} size="sm" className="w-full sm:w-auto">
                      Upload Screenshot
                    </Button>
                    {projectImgPreview !== "" ? (
                      <Image src={projectImgPreview} className="w-full sm:w-48 max-w-48" />
                    ) : selectedProject?.image ? (
                      <Image src={selectedProject.image} className="w-full sm:w-48 max-w-48" />
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

                  <div className="w-full flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button color="danger" variant="light" onPress={onClose} className="w-full sm:w-auto">
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={isSubmitting} className="w-full sm:w-auto">
                      Update Project
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        size="sm"
        className="mx-2"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                {success && <Alert color="success" variant="faded" title={success} />}
                {error && <Alert color="danger" variant="faded" title={error} />}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                  <Button variant="light" onPress={onClose} className="w-full sm:w-auto">Cancel</Button>
                  <Button color="danger" onPress={handleDelete} isLoading={isSubmitting} className="w-full sm:w-auto">Delete</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Projects;