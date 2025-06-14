
/**
 * Utilitários para máscaras de entrada
 */
export function maskCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d{0,3})/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d{0,3})/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})/, "$1.$2.$3-$4")
      .replace(/[-.]+$/, "");
  } else {
    return digits
      .replace(/^(\d{2})(\d{0,3})/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d{0,3})/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d{0,4})/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5")
      .replace(/[-./]+$/, "");
  }
}

export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 5) return digits;
  return digits.replace(/^(\d{5})(\d{0,3})/, "$1-$2").replace(/-$/, "");
}
