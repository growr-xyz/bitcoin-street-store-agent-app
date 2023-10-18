# Bitcoin Street Store Agent App
Web app to manage merchants and products as part of Bitcoin Street Store

## Getting Started

Before everything, `npm i` and create .env (or .env.local) with the following variables:
`NEXT_PUBLIC_BSS_API=` – points to the backend API base URL, e.g. `http://localhost:3333/api` (note that the URL includes `/api` without slash at the end)

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:6001](http://localhost:6001) with your browser to see the result.

This project uses Tailwind CSS, [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load fonts, TanStack (React) Query, Formik, zod and other libraries.

## Learn More & Contacts

To learn more about Bitcoin Street Store, visit our [page at Eventornado](https://eventornado.com/submission/bitcoin-street-store).