import { ProjectCard } from "@/components/comman/ProjectCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { homePageData } from "../data";
import AllPages from "@/service/allPages";
const Home = () => {
  const [Projects, setProjects] = useState();
  console.log("Projects", Projects); 
 
  const availableProjectApiFun = async () => {
    try {
      const response = await AllPages.properties();
      setProjects(response[0]);
    } catch (error) {
      console.error("Error fetching feature projects:", error);
    }
  }; 
  useEffect(() => {
    availableProjectApiFun();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto pb-16 px-6 md:px-8 lg:px-12 2xl:px-0">
      <div className="relative w-full overflow-hidden mt-20 rounded-xl">
        <Image
          src={homePageData?.banner?.image}
          alt={homePageData?.banner?.alt}
          width={1200}
          height={400}
          quality={100}
          className="w-full lg:h-auto md:h-[350px] h-[200px] lg:object-contain object-cover"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto md:pt-12">
        <h2 className="text-center justify-start text-neutral-900 md:text-[28px] text-2xl font-bold  leading-7 md:my-8 my-5">
          {homePageData?.heading}
        </h2>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  items-center md:items-stretch justify-center xl:gap-8 gap-4">
          {homePageData?.projects?.map((project, index) => (
            <ProjectCard
              key={index}
              url={project?.image}
              projectName={project?.projectName}
              total={project?.total}
              available={project?.available}
              onHold={project?.onHold}
              booked={project?.booked}
              homePageData={homePageData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
