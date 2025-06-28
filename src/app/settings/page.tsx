import BasicDetails from "@/components/BasicDetails";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { db } from "@/db";

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
  const projects = await db.project.findMany();
  const skills = await db.skill.findMany();

  return (
    <main className="w-full flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold">Front End Settings Page</h1>
      </div>
      <div className="flex flex-row space-x-4">
        <div className="w-full space-y-4">
          <section
            id="basic-details"
            className="flex flex-col shadow dark:shadow-primary p-4 rounded-2xl w-full max-w-2xl space-y-6"
          >
            <Projects projects={projects} />
          </section>
          <section
            id="basic-details"
            className="flex flex-col shadow dark:shadow-primary p-4 rounded-2xl w-full max-w-2xl space-y-6"
          >
            <Skills skills={skills} />
          </section>
        </div>
        <div className="w-full">
          <section
            id="basic-details"
            className="flex flex-col shadow dark:shadow-primary p-4 rounded-2xl w-full max-w-2xl space-y-6"
          >
            <h2 className="text-2xl">Basic Details</h2>
            <BasicDetails details={basicDetails ?? fallbackDetails} />
          </section>
        </div>
      </div>
    </main>
  );
}
