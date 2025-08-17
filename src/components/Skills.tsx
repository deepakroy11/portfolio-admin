"use client";

import { useRouter } from "next/navigation";

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
  Alert,
  Pagination,
  Spinner,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { Skill } from "@prisma/client";
import { useRef, useState, useMemo } from "react";

interface skillsProps {
  skills: Skill[];
  isLoading?: boolean;
}

const Skills = ({ skills, isLoading: contentLoading = false }: skillsProps) => {
  const router = useRouter();

  //For new skill
  const {
    isOpen: isSkilltModalOpen,
    onOpen: onSkillModalOpen,
    onOpenChange: onSkillModalChange,
  } = useDisclosure();

  //For edit skill
  const {
    isOpen: isSkilltEditModalOpen,
    onOpen: onSkillEditModalOpen,
    onOpenChange: onSkillEditModalChange,
  } = useDisclosure();

  const skillImgRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillImgPreview, setSkillImgPreview] = useState<string>("");
  const [skillImage, setSkillImage] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(skills.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return skills.slice(start, end);
  }, [page, skills]);

  // Image/Logo Upload
  const triggerSkillFile = () => {
    skillImgRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSkillImage(file);
      setSkillImgPreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // reference to the form
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (skillImage) formData.append("skillImage", skillImage);

    try {
      const response = await fetch("/api/settings/skill", {
        method: "POST",
        body: formData,
      });

      const result = response.json();
      if (response.ok) {
        setSuccess("Skill saved successfully.");

        form.reset();
        setSkillImage(null);
        setSkillImgPreview("");
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

  const handleEditFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    if (skillImage) formData.append("skillImage", skillImage);
    if (selectedSkill?.id) {
      formData.append("id", selectedSkill?.id);
    } else {
      setError("Skill id is not set, Please select a skill");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return false;
    }

    try {
      const response = await fetch(`/api/settings/skill`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        console.log(error);
        setError("Unable to update. Please try after sometime");
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
      const result = await response.json();

      if (result.success) {
        setSelectedSkill(result.skill);
        setSuccess("Skill saved successfully.");
        setSkillImage(null);
        setSkillImgPreview("");
        setTimeout(() => {
          router.refresh();
          setSuccess(null);
          onSkillEditModalChange();
        }, 3000);
      }
    } catch (error: unknown) {
      console.log(error);
      setError("Unable to update. Please try after sometime");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // For delete confirmation
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setSkillToDelete(id);
    onDeleteModalOpen();
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;

    setIsSubmitting(true);
    setDeletingSkillId(skillToDelete);

    try {
      const response = await fetch(`/api/settings/skill?id=${skillToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSuccess("Skill deleted successfully.");
        setTimeout(() => {
          setSuccess(null);
          router.refresh();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete skill");
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
      setDeletingSkillId(null);
      onDeleteModalChange();
      setSkillToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl">Skills</h2>
        <Button
          as={Link}
          size="sm"
          color="primary"
          onPress={onSkillModalOpen}
          className="w-full sm:w-auto"
        >
          New Skill
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {contentLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          skills.map((skill, index) => (
          <div
            key={skill.id}
            className="bg-content1 rounded-lg p-4 shadow-sm border"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-default-500">#{index + 1}</span>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setSelectedSkill(skill);
                    onSkillEditModalOpen();
                  }}
                >
                  <BsPencilSquare className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => confirmDelete(skill.id)}
                  isLoading={deletingSkillId === skill.id}
                >
                  {deletingSkillId === skill.id ? <Spinner size="sm" /> : <BsTrash className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={skill.image}
                alt={skill.title}
                className="w-12 h-12 rounded shadow flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{skill.title}</h3>
                <p className="text-xs text-default-500 mt-1 line-clamp-2">
                  {skill.summary}
                </p>
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
            <TableColumn>Image</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((skill, index) => (
              <TableRow key={skill.id} className="items-center">
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-32 truncate">
                  {skill.title}
                </TableCell>
                <TableCell>
                  <Image
                    src={skill.image}
                    alt={skill.title}
                    className="w-10 h-10 shadow rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setSelectedSkill(skill);
                        onSkillEditModalOpen();
                      }}
                    >
                      <BsPencilSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => confirmDelete(skill.id)}
                      isLoading={deletingSkillId === skill.id}
                    >
                      {deletingSkillId === skill.id ? <Spinner size="sm" /> : <BsTrash className="w-4 h-4" />}
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
        isOpen={isSkilltEditModalOpen}
        onOpenChange={(isOpen) => {
          onSkillEditModalChange();
          if (!isOpen) setSelectedSkill(null);
        }}
        size="2xl"
        scrollBehavior="inside"
        className="mx-2"
        classNames={{
          base: "max-h-[90vh]",
          body: "p-4 sm:p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Skill
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={handleEditFormSubmit}>
                  <Input
                    label="Skill Title"
                    name="skill-title"
                    labelPlacement="outside"
                    placeholder="Enter skill title"
                    isRequired
                    defaultValue={selectedSkill?.title || ""}
                  />
                  <Textarea
                    label="Skill Summary"
                    name="skill-summary"
                    labelPlacement="outside"
                    placeholder="Enter skill summary"
                    isRequired
                    defaultValue={selectedSkill?.summary || ""}
                  />
                  <div className="w-full flex flex-col sm:flex-row justify-start p-3 bg-primary-100 rounded-2xl items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                      onPress={triggerSkillFile}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Upload Logo
                    </Button>
                    {skillImgPreview !== "" ? (
                      <Image
                        src={skillImgPreview}
                        className="w-full sm:w-24 max-w-24 shadow p-2 rounded"
                      />
                    ) : selectedSkill?.image ? (
                      <Image
                        src={selectedSkill.image}
                        className="w-full sm:w-24 max-w-24 shadow p-2 rounded"
                      />
                    ) : null}
                  </div>
                  <Input
                    type="file"
                    name="skill-image"
                    ref={skillImgRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
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
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isSkilltModalOpen}
        onOpenChange={onSkillModalChange}
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
                New Skill
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={handleFormSubmit}>
                  <Input
                    label="Skill Title"
                    name="skill-title"
                    labelPlacement="outside"
                    placeholder="Enter skill title"
                    isRequired
                  />
                  <Textarea
                    label="Skill Summary"
                    name="skill-summary"
                    labelPlacement="outside"
                    placeholder="Enter skill summary"
                    isRequired
                  />
                  <div className="w-full flex flex-col sm:flex-row justify-start p-3 bg-primary-100 rounded-2xl items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button onPress={triggerSkillFile} size="sm" className="w-full sm:w-auto">
                      Upload Logo
                    </Button>
                    {skillImgPreview != "" && (
                      <Image
                        src={skillImgPreview}
                        className="w-full sm:w-24 max-w-24 shadow p-2 rounded"
                      />
                    )}
                  </div>
                  <Input
                    type="file"
                    name="skill-image"
                    ref={skillImgRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
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
                      Save Skill
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
        classNames={{
          body: "p-4 sm:p-6"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this skill? This action cannot
                  be undone.
                </p>

                {success && (
                  <Alert color="success" variant="faded" title={success} />
                )}
                {error && (
                  <Alert color="danger" variant="faded" title={error} />
                )}

                <div className="w-full flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                  <Button color="default" variant="light" onPress={onClose} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={handleDelete}
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Skills;