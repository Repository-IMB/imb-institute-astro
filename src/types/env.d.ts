declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    MAIL_GATEWAY_URL: string;
    MAIL_GATEWAY_TOKEN: string;
    MAIL_FROM: string;
    MAIL_ADMISSIONS_TO: string;
    MAIL_FORCE_TO?: string;
  }
}
