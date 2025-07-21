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
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { Skill } from "@prisma/client";
import { useRef, useState } from "react";

interface skillsProps {
  skills: Skill[];
}

const Skills = ({ skills }: skillsProps) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [skillImgPreview, setSkillImgPreview] = useState<string>("");
  const [skillImage, setSkillImage] = useState<File | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  console.log(selectedSkill)

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
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  const handleEditFormSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setIsLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    if (skillImage) formData.append("skillImage", skillImage);

    try{
      const response = await fetch(`/api/settings/skill/${selectedSkill?.id}`,{
        method: "PUT",
        body:formData
      })
      if (response.ok) {
        setSuccess("Skill saved successfully.");
        setSkillImage(null);
        setSkillImgPreview("");
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      }
    }catch(error:unknown){
      console.log(error)
      setError("Unable to update. Please try after sometime");
      setTimeout(() => {
        setError(null)
      }, 3000);
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Skills</h2>
        <Button as={Link} size="sm" color="primary" onPress={onSkillModalOpen}>
          New Skill
        </Button>
      </div>
      <Table isVirtualized maxTableHeight={400} rowHeight={50}>
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {skills.map((skill, index) => (
            <TableRow className="items-center">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{skill.title}</TableCell>
              <TableCell className="">
                <Image
                  src={skill.image}
                  alt={skill.title}
                  className="w-10 h-10 shadow"
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Link onPress={()=>{setSelectedSkill(skill); onSkillEditModalOpen();}} className="cursor-pointer">
                  <BsPencilSquare className="w-5 h-5" />
                </Link>
                <Link className="cursor-pointer"><BsTrash className="w-5 h-5 text-danger" /></Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isSkilltEditModalOpen}
        onOpenChange={(isOpen)=>{
          onSkillEditModalChange();
          if (!isOpen) setSelectedSkill(null); 
        }}
        size="2xl"
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
                    value={selectedSkill?.title}
                  />
                  <Textarea
                    label="Skill Summary"
                    name="skill-summary"
                    labelPlacement="outside"
                    placeholder="Enter skill summary"
                    isRequired
                    value={selectedSkill?.summary}
                  />
                  <div className="w-full flex justify-start p-2 bg-primary-100 rounded-2xl items-center space-x-4">
                    <Button onPress={triggerSkillFile}>
                      Upload SKill Logo
                    </Button>
                    { skillImgPreview !== "" ? (
                      <Image
                        src={skillImgPreview}
                        width={100}
                        className="shadow p-2"
                      />)
                     : selectedSkill?.image?
                      <Image
                        src={selectedSkill.image}
                        width={100}
                        className="shadow p-2"
                      />
                    :null}
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

                  <div className="w-full flex justify-end space-x-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={isLoading}>
                      Save Your Changes
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
                  <div className="w-full flex justify-start p-2 bg-primary-100 rounded-2xl items-center space-x-4">
                    <Button onPress={triggerSkillFile}>
                      Upload SKill Logo
                    </Button>
                    {skillImgPreview != "" && (
                      <Image
                        src={skillImgPreview}
                        width={100}
                        className="shadow p-2"
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

                  <div className="w-full flex justify-end space-x-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" isLoading={isLoading}>
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
