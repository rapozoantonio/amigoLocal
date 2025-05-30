export default {
  name: "role-permissions",
  sections: [
    {
      name: "Role Description",
      index: 1,
      type: "section",
      fields: [
        {
          id: "id",
          type: "text",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "description",
          type: "textarea",
          size: "lg",
        },
      ],
    },
  ],
};
