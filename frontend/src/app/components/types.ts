
export type MessageResponse = {
  message:string,
  code:number
}

export type IdMessageResponse = MessageResponse&{id:string};

export type ListInfoReponse<T>={
  list: T[],
  requestable:number
}
