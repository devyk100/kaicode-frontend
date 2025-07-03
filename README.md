# KaiCode Frontend

KaiCode is a web application that provides a collaborative coding environment with AI assistance. It allows multiple users to code together in real-time, with features such as:

*   **Real-time Collaboration:** Code together with your team, seeing everyone's changes instantly.
*   **AI-Powered Assistance:** Get intelligent code suggestions and recommendations.
*   **Multi-language Support:** Supports multiple programming languages, including Python and JavaScript.
*   **Custom Code Judge:** Test your code against custom test cases and get instant feedback.
*   **Real-time Broadcasting:** Every code submission is instantly broadcasted to all session participants.
*   **Mobile Coding:** Code on the go with a mobile-optimized interface.

## Technologies Used

*   **Next.js:** A React framework for building web applications.
*   **Yjs:** A CRDT system for real-time collaboration.
*   **Monaco Editor:** A code editor component.
*   **ShadCN UI:** A set of accessible UI components.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Zustand:** A state management library.
*   **Drizzle ORM:** A TypeScript ORM.
*   **PostgreSQL:** A relational database.
*   **Redis:** An in-memory data store.
*   **NextAuth.js:** Authentication library.

## Getting Started

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    ```
2.  Install dependencies:

    ```bash
    pnpm install
    ```
3.  Configure environment variables:

    Create a `.env` file and set the following environment variables:

    ```
    DATABASE_URL=
    REDIS_URL=
    REDIS_PASSWORD=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    NEXTAUTH_SECRET=
    NEXTAUTH_URL=
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

*   [Next.js Documentation](https://nextjs.org/docs)
*   [Yjs Documentation](https://docs.yjs.dev/)
*   [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
*   [Radix UI Documentation](https://www.radix-ui.com/)
*   [Tailwind CSS Documentation](https://tailwindcss.com/)
*   [Zustand Documentation](https://github.com/pmndrs/zustand)
*   [Drizzle ORM Documentation](https://orm.drizzle.team/)
*   [NextAuth.js Documentation](https://next-auth.js.org/)

## Contributing

Contributions are welcome! Please submit a pull request with your changes.
