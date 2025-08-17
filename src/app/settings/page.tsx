import { db } from "@/db";
import SettingsTabs from "@/components/SettingsTabs";
import { BasicDetails } from "@prisma/client";

const fallbackDetails: BasicDetails = {
  id: "",
  siteName: null,
  tagLine: null,
  profileImage: null,
  aboutMe: null,
  aboutMeImage: null,
  contactEmail: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default async function SettingPage() {
  const basicDetails = await db.basicDetails.findFirst();
  const projects = await db.project.findMany({
    include: {
      skills: true,
    },
  });
  const skills = await db.skill.findMany();

  return (
    <main className="w-full flex-1 py-4 sm:py-8 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Portfolio Settings
        </h1>
        <p className="text-default-600 text-sm mt-1">
          Manage your portfolio content and information
        </p>
      </div>

      {/* Tabs */}
      <SettingsTabs
        basicDetails={basicDetails}
        projects={projects}
        skills={skills}
        fallbackDetails={fallbackDetails}
      />
    </main>
  );
}
