export const formatUserResponse = (user: any) => ({
  id: user._id ? user._id.toString() : user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  birthDate: user.birthDate,
  city: user.city,
  country: user.country,
  email: user.email,
});
