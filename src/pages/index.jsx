import { ProjectCard } from "@/components/comman/ProjectCard";
import Image from "next/image";
import React from "react";
const projects = [
  {
    projectName: "Navayan's Capital Park",
    total: 150,
    available: 35,
    onHold: 20,
    booked: 10,
  },
  {
    projectName: "Navayan's West Gate",
    total: 150,
    available: 35,
    onHold: 20,
    booked: 10,
  },
  {
    projectName: "Navayan's East Enclave",
    total: 200,
    available: 60,
    onHold: 25,
    booked: 15,
  },
  {
    projectName: "Navayan's Capital Park",
    total: 150,
    available: 35,
    onHold: 20,
    booked: 10,
  },
  {
    projectName: "Navayan's West Gate",
    total: 150,
    available: 35,
    onHold: 20,
    booked: 10,
  },
  {
    projectName: "Navayan's East Enclave",
    total: 200,
    available: 60,
    onHold: 25,
    booked: 15,
  },
];
const Home = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 md:px-8 lg:px-12 2xl:px-0">
      <div className="relative w-full overflow-hidden mt-20 rounded-xl">
        <Image
          src="/images/home1.png"
          alt="A happy family jumping for joy in a park"
          width={1200}
          height={400}
          quality={100}
          className="w-full lg:h-auto md:h-[350px] h-full lg:object-contain object-cover"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto pt-12">
        <h2 className="text-center justify-start text-neutral-900 md:text-3xl text-2xl font-bold  leading-7 my-8">
          Available Projects
        </h2>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  items-center md:items-stretch justify-center xl:gap-8 gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              projectName={project.projectName}
              total={project.total}
              available={project.available}
              onHold={project.onHold}
              booked={project.booked}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
