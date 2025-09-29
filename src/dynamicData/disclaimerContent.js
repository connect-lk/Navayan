// data/disclaimerContent.js
const disclaimerContent = {
  title: "Disclaimer",
  sections: [
    {
      content: [
        "The information provided on this website by ",
        { text: "Navayan Properties", bold: true },
        " is for general informational purposes only. While every effort is made to ensure accuracy, reliability, and completeness of the content, the Company makes no warranties or representations, express or implied, regarding the correctness of information, project details, pricing, availability, or timelines.",
      ],
      list: [
        "All visuals, images, layouts, brochures, and project plans are artistic impressions for representation purposes only and may differ from actual construction.",
        "Project specifications, approvals, and amenities are subject to change as per the discretion of the developer, regulatory authorities, or applicable laws.",
        "Nothing on this website constitutes legal, financial, or professional advice. Users are advised to independently verify all details, specifications, and statutory approvals before making any property-related decisions.",
        "Navayan Properties shall not be held liable for any direct, indirect, incidental, or consequential loss or damage arising from the use of this website or reliance on its content.",
        "This website may contain links to third-party websites. Navayan Properties is not responsible for the content, privacy practices, or reliability of such external websites.",
      ],
      extra: [
        "By accessing this website, you acknowledge and agree to this Disclaimer and the accompanying ",
        { text: "Privacy Policy", bold: true },
        " and ",
        { text: "Terms & Conditions.", bold: true },
      ],
    },
    {
      content: [
        "For the most updated information, please contact us directly at:",
      ],
      contact: {
        name: "Navayan Properties",
        address1:
          "D-2 Silver Estate, University Road, New Balwant Nagar, Gwalior,",
        address2: "Madhya Pradesh – 474011",
        phone: "+91-9179096306",
        website: {
          url: "http://localhost:4600/",
          text: "Home - Navayan",
        },
      },
    },
  ],
};

export default disclaimerContent;
