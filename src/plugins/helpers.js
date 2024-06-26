export default {
  install(app) {
    const helpers = {};
    helpers.momento = (data) => {
      const antes = data;
      const agora = Date.now();
      const minutos = (agora - antes) / 1000 / 60;
      if (minutos < 60) {
        return Math.floor(minutos) + " min";
      }
      const horas = minutos / 60;
      if (horas < 24) {
        return Math.floor(horas) + " h";
      }
      const dias = horas / 24;
      if (dias < 7) {
        return Math.floor(dias) + " d";
      }
      const semanas = dias / 7;
      return Math.floor(semanas) + " sem";
    };

    helpers.fieldAttrs = {
      rounded: "lg",
      variant: "outlined",
      density: "compact",
      color: "primary",
      // class: "mt-1",
      hideDetails: "auto",
    };

    helpers.toDate = (date) => {
      const options = { weekday: "short", day: "numeric", month: "short" };
      return new Intl.DateTimeFormat("en-US", options)
        .format(new Date(date))
        .toUpperCase();
    };

    helpers.rules = {
      required: (value) => {
        return (
          (!!value && Array.isArray(value)
            ? value?.length > 0
            : !!value && typeof value === "string"
            ? value?.length > 0
            : !!value) || "Field is required"
        );
      },
      notNull: (value) => value !== null,
      lengthMin4: (value) =>
        value.length > 3 || "Must be at least 4 characters",
      lengthMin: (value) => value.length > 0 || "Field is required",
    };

    app.provide("$helpers", helpers);
  },
};
