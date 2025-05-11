import Swal from "sweetalert2";

const notify = {
  toast,
};

function toast(text, type = "success") {
  return Swal.fire({
    html: text,
    icon: type,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
}

export default {
  install(app) {
    app.provide("$swal", Swal);
    app.provide("$notify", notify);
  },
};
