export function checkExpirationDate(expirationDate: string | Date) {
   const currentDate = new Date();
   const inputDate = new Date(expirationDate);
   if (currentDate.getTime() < inputDate.getTime()) return true;
   return false;
}
