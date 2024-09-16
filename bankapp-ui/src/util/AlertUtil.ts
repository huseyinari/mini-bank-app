import Swal from 'sweetalert2'

export const showSuccessAlert = (title: string, message: string) => {
    Swal.fire({
        title,
        text: message,
        icon: 'success',
        confirmButtonText: 'Tamam'
      })
}

export const showFailAlert = (title: string, errorList: string[] | null) => {
    let message: string;
    if (!errorList) {
        message = '<li>Bilinmeyen bir hata oluştu !</li>';
    } else {
        message = errorList.map(error => `<li>${error}</li>`).join('');
    }

    Swal.fire({
        title,
        html: `<ul>${message}</ul>`,
        icon: 'error',
        confirmButtonText: 'Kapat'
      })
}