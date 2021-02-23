interface SentryCredentials {
  readonly dsn?: string;
}

interface Credentials {
  readonly sentry: SentryCredentials;
}

const prodCredentials: Credentials = {
  sentry: {
    dsn: "https://b74f00882b0c43d8887e44ef5f51d679@o529121.ingest.sentry.io/5647042",
  },
};

const testCredentials: Credentials = {
  sentry: {},
};

export const credentials = process.env.NODE_ENV === "production" ? prodCredentials : testCredentials;
