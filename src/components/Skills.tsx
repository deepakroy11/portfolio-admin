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
    if(selectedSkill?.id) {
      formData.append("id", selectedSkill?.id)
    } else{
      setError("Skill id is not set, Please select a skill");
      setTimeout(() => {
        setError(null)
      }, 3000);
      return false;
    }

    try{
      const response = await fetch(`/api/settings/skill`,{
        method: "PUT",
        body:formData
      })
      if (!response.ok) {
       console.log(error)
        setError("Unable to update. Please try after sometime");
        setTimeout(() => {
          setError(null)
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
          onSkillEditModalChange(); }, 3000);
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

    // For delete confirmation
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setSkillToDelete(id);
    onDeleteModalOpen();
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(`/api/settings/skill?id=${skillToDelete}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
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
      setIsLoading(false);
      onDeleteModalChange();
      setSkillToDelete(null);
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
                <Link className="cursor-pointer" onPress={()=>confirmDelete(skill.id)}><BsTrash className="w-5 h-5 text-danger" /></Link>
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
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
                
                {success && (
                  <Alert color="success" variant="faded" title={success} />
                )}
                {error && (
                  <Alert color="danger" variant="faded" title={error} />
                )}
                
                <div className="w-full flex justify-end space-x-2 mt-4">
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={handleDelete} 
                    isLoading={isLoading}
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
