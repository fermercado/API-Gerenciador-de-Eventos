export const formatEventResponse = (event: any) => ({
  _id: event._id.toString(),
  description: event.description,
  dayOfWeek: event.dayOfWeek,
  userId: event.userId.toString(),
});
