export const cpfIsComplete = (data: string) => {

  const clearCpf = data.trim().replaceAll('.', '').replaceAll('-', '')
  if (clearCpf.length !== 11) {
    return false;
  }

  for (let i = 0; i < clearCpf.length; i++) {
    if (clearCpf[i] < '0' || clearCpf[i] > '9') {
      return false;
    }
  }

  return true;
}

export const cpfIsValid = (data: string) => {
  const clearCpf = data.trim().replaceAll('.', '').replaceAll('-', '')

  console.log(clearCpf)
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(clearCpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if ((remainder == 10) || (remainder == 11)) {
    remainder = 0;
  }

  if (remainder != parseInt(clearCpf.substring(9, 10))) {
    return false;
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(clearCpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if ((remainder == 10) || (remainder == 11)) {
    remainder = 0;
  }

  if (remainder != parseInt(clearCpf.substring(10, 11))) {
    return false;
  }

  return true;
}
