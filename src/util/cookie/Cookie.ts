export class Cookie {
  static set (name: string, value: string): void {
    document.cookie = `${name}=${value}`
  }

  static get (name: string): string | undefined {
    const cookies = document.cookie
    const value = cookies
      ?.split("; ")
      ?.find((row: string) => row.startsWith(`${name}=`))
      ?.split("=")[1]
    return value || undefined
  }
}