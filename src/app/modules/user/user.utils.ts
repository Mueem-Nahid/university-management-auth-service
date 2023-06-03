import findLastUserId from './user.service'

export const generateUserId = async (): Promise<string> => {
  const currentId: string = (await findLastUserId()) || '0'
  return (parseInt(currentId) + 1).toString().padStart(5, '0')
}
