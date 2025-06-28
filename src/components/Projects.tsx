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
  Alert,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { BsPencilSquare } from "react-icons/bs";
import type { Project } from "@prisma/client";

interface projectsProps {
  projects: Project[];
}

const Projects = ({ projects }: projectsProps) => {
  const {
    isOpen: isProjectModalOpen,
    onOpen: onProjectModalOpen,
    onOpenChange: onProjectMOdalChange,
  } = useDisclosure();
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <Button href="#" size="sm" onPress={onProjectModalOpen}>
          New Project
        </Button>
      </div>
      <Table>
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
                <Form className="space-y-4">
                  <Input
                    label="Project Name"
                    labelPlacement="outside"
                    placeholder="Enter project name"
                    isRequired
                  />
                  <Textarea
                    label="Project Summary"
                    labelPlacement="outside"
                    placeholder="Enter project summary"
                    isRequired
                  />
                  <Input
                    type="file"
                    label="Project Screenshot"
                    labelPlacement="outside"
                    placeholder="Enter project Screenshot"
                    isRequired
                  />
                  <Alert
                    color="success"
                    variant="faded"
                    title="Lorem Ipsum Dollar!"
                  />
                  <Alert
                    color="danger"
                    variant="faded"
                    title="Lorem Ipsum Dollar!"
                  />
                  <div className="w-full flex justify-end space-x-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={true}>
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
