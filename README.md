# Bitcoin Street Store Agent App

Web app to manage merchants and products as part of Bitcoin Street Store

## Getting Started

Before everything, `npm i` and create .env (or .env.local) with the following variables:
`NEXT_PUBLIC_BSS_API=` – points to the backend API base URL, e.g. `http://localhost:3333/api` (note that the URL includes `/api` without slash at the end)

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:6001](http://localhost:6001) with your browser to see the result.

You need a browser extension such as [Alby](https://getalby.com/) with your Nostr keys imported into it to log into Bitcoin Street Store Agent App and interact with its backend services.

## Technology Stack

This project uses:
- TypeScript for strong typing, reduction of errors and improved developer experience.
- Next.js V13 with App Router – while not so useful in the current scope, we plan to have a publicly available storefront in future, which will benefit from its SSR/SSG features.
- Tailwind CSS for styling of components.
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load fonts.
- TanStack Query (formerly React Query) for server state and managing data fetching & updating.
- React Context for client state.
- Formik for form management.
- zod for unified schema validation.
- nostr-tools for Nostr connectivity. The integration is adapted from the implementation in [uBlog](https://github.com/nodetec/ublog).

This application relies on [Nostr Wallet Connect](https://nwc.getalby.com/about) to connect to the user's Nostr identity (public key), fetch their profile from a Nostr relay, and sign a [NIP-98](https://github.com/nostr-protocol/nips/blob/master/98.md) event for HTTP authentication to access the [backend services](https://github.com/growr-xyz/bitcoin-street-store-services). This is pretty cool, as your identity remains your own!

## Learn More & Contacts

To learn more about Bitcoin Street Store, visit our [page at Eventornado](https://eventornado.com/submission/bitcoin-street-store), and follow the [project repo on GitHub](https://github.com/growr-xyz/bitcoin-street-store-agent-app).