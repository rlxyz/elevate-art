export const fetcher = (route: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route}`).then((r) => r.json())

export const fetcherPost = (route: string, body: any) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
  }).then((r) => r.json())
