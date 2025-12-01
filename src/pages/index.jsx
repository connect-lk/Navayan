import { ProjectCard } from "@/components/comman/ProjectCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { homePageData } from "../data";
import AllPages from "@/service/allPages";
const Home = () => {
  const [projects, setProjects] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    // if (!initialProjects?.length) {
    const availableProjectApiFun = async () => {
      try {
        setLoading(true);
        const response = await AllPages.properties(); 
        setProjects(response || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
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
          quality={95}
          priority
          className="w-full lg:h-auto md:h-[350px] h-[200px] lg:object-contain object-cover"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto md:pt-12">
        <h2 className="text-center justify-start text-neutral-900 md:text-[28px] text-2xl font-bold  leading-7 md:my-8 my-5">
          {homePageData?.heading}
        </h2>
        {loading ? (
          <div className="flex flex-col justify-center items-center p-8">
            <div
              className={`animate-spin rounded-full h-10 w-10 border-b-2 border-[#066FA9]`}
              style={{ borderoBttomColor: "#066FA9" }}
            />
            <p className="mt-2 text-sm text-gray-600 animate-pulse">
              Loading projects...
            </p>
          </div>
        ) : (
          <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  items-center md:items-stretch justify-center xl:gap-8 gap-4">
            {projects?.map((project, index) => (
              <ProjectCard
                key={index}
                url={project?.acf?.property_image?.url}
                projectName={project?.title?.rendered}
                total={project?.flats_available?.total}
                available={project?.flats_available?.available}
                onHold={project?.flats_available?.hold}
                booked={project?.flats_available?.booked}
                slug={project?.slug}
                homePageData={homePageData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
