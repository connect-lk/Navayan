"use client";
import disclaimerContent from "@/dynamicData/disclaimerContent";
import Link from "next/link";

const Disclaimer = () => {


  
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 sm:mt-10 mt-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 sm:text-center text-start text-[#066FA9]">
        {disclaimerContent?.title}
      </h1>

      {disclaimerContent?.sections?.map((section, idx) => (
        <section key={idx} className="mb-10">
          {section?.content.map((item, i) =>
            typeof item === "string" ? (
              <p key={i} className="text-lg mb-4">
                {item}
              </p>
            ) : (
              <p key={i} className="text-lg mb-4">
                <span className="font-semibold">{item?.text}</span>
              </p>
            )
          )}

          {section?.list && (
            <ul className="list-disc list-inside space-y-1 text-lg mb-4">
              {section?.list.map((listItem, index) => (
                <li key={index}>{listItem}</li>
              ))}
            </ul>
          )}

          {section?.extra && (
            <p className="text-lg mb-4">
              {section?.extra.map((item, i) =>
                typeof item === "string" ? (
                  item
                ) : (
                  <span key={i} className="font-semibold">
                    {item?.text}
                  </span>
                )
              )}
            </p>
          )}

          {section?.contact && (
            <div className="space-y-2 text-lg">
              <p>{section?.contact?.name}</p>
              <p>{section?.contact?.address1}</p>
              <p>{section?.contact?.address2}</p>
              <p>Phone: {section?.contact?.phone}</p>
              <p>
                Website ::
                <Link
                  className="text-[#066FA9] underline"
                  href={section?.contact?.website?.url}
                  //   target="_blank"
                  rel="noopener noreferrer"
                >
                  {section?.contact?.website?.text}
                </Link>
              </p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default Disclaimer;
