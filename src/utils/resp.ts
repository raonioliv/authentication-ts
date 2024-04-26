const resp = <Type>(s: number, d: Type, m?: string) => {
  return [s, d, { message: m }] as [number, Type, unknown]
}

export { resp }
