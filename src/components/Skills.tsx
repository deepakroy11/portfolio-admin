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
import type { Skill } from "@prisma/client";

interface skillsProps {
  skills: Skill[];
}

const Skills = ({ skills }: skillsProps) => {
  const {
    isOpen: isSkilltModalOpen,
    onOpen: onSkillModalOpen,
    onOpenChange: onSkillModalChange,
  } = useDisclosure();

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Skills</h2>
        <Button as={Link} size="sm" onPress={onSkillModalOpen}>
          New Skill
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {skills.map((skill, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{skill.title}</TableCell>
              <TableCell className="">
                <Image
                  src={skill.image}
                  alt={skill.title}
                  className="w-10 h-10 shadow"
                />
              </TableCell>
              <TableCell>
                <Link onPress={onSkillModalOpen} className="cursor-pointer">
                  <BsPencilSquare className="w-5 h-5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isSkilltModalOpen}
        onOpenChange={onSkillModalChange}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Skill
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4">
                  <Input
                    label="Project Skill"
                    labelPlacement="outside"
                    placeholder="Enter skill name"
                    isRequired
                  />
                  <Textarea
                    label="Project Skill"
                    labelPlacement="outside"
                    placeholder="Enter skill summary"
                    isRequired
                  />
                  <Input
                    type="file"
                    label="Skill Logo"
                    labelPlacement="outside"
                    placeholder="Enter Skill Logo"
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
                      Save Skill
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

export default Skills;
