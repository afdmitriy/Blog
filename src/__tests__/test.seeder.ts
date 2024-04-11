export const testSeeder = {
   createUserDto() {
      return {
         login: 'test',
         email: 'test@gmail.com',
         pass: '123456789',
      };
   },

   createUserDtos(count: number) {
      const users: { login: string; email: string; pass: string }[] = [];

      for (let i = 0; i <= count; i++) {
         users.push({
            login: 'test' + i,
            email: `test${i}@gmail.com`,
            pass: '123456789',
         });
      }

      return users;
   },
};
