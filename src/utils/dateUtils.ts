import { parse, isValid, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDateToBrazilian = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateToISO = (date: string): Date => {
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  if (!isValid(parsedDate)) {
    throw new Error('Data inválida');
  }
  return parsedDate;
};
