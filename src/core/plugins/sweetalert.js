import Swal from "sweetalert2";

const notify = {
  toast,
  confirmDelete,
  confirmSuccess,
  success,
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

function confirmDelete(title, text) {
  return Swal.fire({
    title: "Excluir " + title + "?",
    html: `Tem certeza que deseja excluir "${text}"? <br> <small class="text-error">Essa ação não pode ser desfeita.</small>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Excluir",
    cancelarButtonText: "Cancelar",
    customClass: {
      cancelButton: "bg-grey-darken-4",
      confirmButton: "bg-primary",
    },
  });
}

function confirmSuccess(title, text) {
  return Swal.fire({
    title,
    text,
    icon: "success",
  });
}

function success(title, text) {
  return Swal.fire({
    title,
    text,
    icon: "success",
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
