import Swal from 'sweetalert2';

export function showSuccessDialog(title, text = '') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#0ea5e9',
  });
}

export function showErrorDialog(title, text = '') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444',
  });
}

export function showWarningDialog(title, text = '') {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#f59e0b',
  });
}

export function showConfirmDialog(
  title,
  text = '',
  confirmText = 'Ya',
  cancelText = 'Batal'
) {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#0ea5e9',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function coverUrl(cover) {
  if (!cover) return null;
  if (cover.startsWith('http')) return cover;
  return `https://open-api.delcom.org/${cover}`;
}

export function photoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `https://open-api.delcom.org/${photo}`;
}