import Swal from "sweetalert2";

export const alertSuccess = async (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: "Success",
    text: message,
    timer: 1000,
  })
}

export const alertError = async (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: "Ups",
    text: message,
  })
}