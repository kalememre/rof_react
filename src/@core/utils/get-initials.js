// ** Returns initials from string
export const getInitials = string => string.toUpperCase().split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')
