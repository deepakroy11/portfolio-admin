"use client";
import { Form, Input, Textarea, Button, Alert, Image } from "@heroui/react";
import type { BasicDetails } from "@prisma/client";
import { useState, useRef } from "react";

const BasicDetails = ({ details }: { details: BasicDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile image
  const [profileImgPreview, setProfileImgPreview] = useState<string>(
    details.profileImage || ""
  );
  const [imageProfileImg, setImageProfileImg] = useState<File | null>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  // About me image
  const [aboutMeImgPreview, setAboutMeImgPreview] = useState<string>(
    details.aboutMeImage || ""
  );
  const [aboutMeImg, setAboutMeImg] = useState<File | null>(null);
  const aboutMeImgRef = useRef<HTMLInputElement>(null);

  // Handle Profile Image
  const handleProfileImgChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageProfileImg(file);
      setProfileImgPreview(URL.createObjectURL(file));
    }
  };
  const profileImgBtnChange = () => {
    profileImgRef.current?.click();
  };

  // Handle About Me Image
  const handleAboutMeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAboutMeImg(file);
      setAboutMeImgPreview(URL.createObjectURL(file));
    }
  };
  const aboutMeImgBtnChange = () => {
    aboutMeImgRef.current?.click();
  };

  // Handle submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (imageProfileImg) formData.append("profileImg", imageProfileImg);
    if (aboutMeImg) formData.append("aboutMeImg", aboutMeImg);

    try {
      const response = await fetch("api/settings/basic-details", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message || "Data saved successfully.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Something went wrong...");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-full max-w-2xl space-y-4" onSubmit={handleSubmit}>
      <Input
        name="site-name"
        label="Site Name"
        labelPlacement="outside"
        placeholder="Please enter your name"
        defaultValue={details.siteName || ""}
        isRequired
      />
      <Input
        name="tag-line"
        label="Tag Line"
        labelPlacement="outside"
        placeholder="Please enter a tagline"
        defaultValue={details.tagLine || ""}
      />
      <Input
        type="email"
        name="contact-email"
        label="Contact Email"
        labelPlacement="outside"
        placeholder="Please enter contact email"
        defaultValue={details.contactEmail || ""}
        isRequired
      />
      <div className="w-full flex flex-col sm:flex-row justify-start items-center space-y-2 sm:space-y-0 sm:space-x-4 rounded-2xl p-3 sm:p-4 bg-primary-50">
        <Button onPress={profileImgBtnChange} size="sm" className="w-full sm:w-auto">
          Upload Profile Image
        </Button>
        {details.profileImage != "" && (
          <Image src={profileImgPreview} className="w-full sm:w-24 max-w-24" isBlurred />
        )}
        <Input
          type="file"
          name="profile-img"
          id="profile-img"
          ref={profileImgRef}
          className="hidden"
          onChange={handleProfileImgChange}
          accept="image/*"
        />
      </div>

      <Textarea
        name="about-me"
        label="About Me"
        labelPlacement="outside"
        defaultValue={details.aboutMe || ""}
        isRequired
      />

      <div className="w-full flex flex-col sm:flex-row justify-start items-center space-y-2 sm:space-y-0 sm:space-x-4 rounded-2xl p-3 sm:p-4 bg-primary-50">
        <Button onPress={aboutMeImgBtnChange} size="sm" className="w-full sm:w-auto">
          Upload About Me Image
        </Button>
        {details.aboutMeImage != "" && (
          <Image src={aboutMeImgPreview} className="w-full sm:w-48 max-w-48" isBlurred />
        )}
        <Input
          type="file"
          name="aboutme-img"
          id="aboutme-img"
          ref={aboutMeImgRef}
          className="hidden"
          onChange={handleAboutMeImg}
          accept="image/*"
        />
      </div>

      {success && <Alert color="success" title={success} />}
      {error && <Alert color="danger" title={error} />}
      <div className="w-full">
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default BasicDetails;
