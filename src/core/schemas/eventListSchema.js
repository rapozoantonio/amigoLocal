export default {
  name: "eventList",
  sections: [
    {
      name: "Informações básicas",
      index: 1,
      type: "section",
      fields: [
        // {
        //   id: "phone",
        //   label: "Phone",
        //   type: "phone",
        //   size: "sm",
        // },
        // {
        //   id: "color", // Keep id unchanged
        //   label: "Color",
        //   type: "color",
        //   size: "auto",
        //   fieldParams: {
        //     variant: "mini",
        //     random: true,
        //   },
        //   rules: ["required"],
        // },
        // {
        //   id: "color2", // Keep id unchanged
        //   label: "Color",
        //   type: "color",
        //   size: "auto",
        //   fieldParams: {
        //     random: true,
        //   },
        //   rules: ["required"],
        // },
        // {
        //   id: "icon", // Keep id unchanged
        //   label: "Icone",
        //   type: "icon",
        //   size: "auto",
        //   initial: "mdi-account",
        //   fieldParams: {
        //     variant: "mini",
        //     // allowCustom: false,
        //   },
        //   items: [
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //   ],
        //   rules: ["required"],
        // },
        // {
        //   id: "icon", // Keep id unchanged
        //   label: "Icone",
        //   type: "icon",
        //   size: "auto",
        //   initial: "mdi-account",
        //   fieldParams: {
        //     allowCustom: false,
        //   },
        //   items: [
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //     "mdi-account",
        //     "mdi-delete",
        //     "mdi-pencil",
        //   ],
        //   rules: ["required"],
        // },
        {
          id: "name", // Keep id unchanged
          label: "Nome",
          type: "text",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "image", // Keep id unchanged
          label: "Imagem",
          type: "image",
          size: "lg",
        },
        {
          id: "images", // Keep id unchanged
          label: "Images",
          type: "gallery",
          size: "lg",
          max: 4,
        },
        {
          id: "startDate",
          label: "Data e hora de inicio",
          type: "datetime",
          size: "sm",
          rules: ["required"],
          initial: new Date().toISOString(),
        },
        {
          id: "endDate",
          label: "Data e hora de fim",
          type: "datetime",
          size: "sm",
          min: "field:startDate",
        },
        {
          id: "location",
          label: "Local",
          type: "text",
          size: "lg",
          // rules: ["required"],
          fieldParams: {
            prependInnerIcon: "mdi-map",
          },
        },
      ],
    },
  ],
};
