import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./lib/storage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      googleId: string | null;
      email: string | null;
      displayName: string | null;
    }
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = "johnmichaelkuczynski@gmail.com";
const CALLBACK_PATH = "/api/auth/google/callback";

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.REPLIT_DEPLOYMENT === "1";

// ---------------------------------------------------------------------------
// Session store (dedicated pool so it can outlive app restarts)
// ---------------------------------------------------------------------------

const PgSession = connectPgSimple(session);

const sessionPool = new pg.Pool({
  connectionString:
    process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ---------------------------------------------------------------------------
// Callback URL helpers
// ---------------------------------------------------------------------------

/**
 * Returns the base URL of the app as seen by the client.
 * Uses REPLIT_DOMAINS (set automatically in deployment) before falling back
 * to the dev domain or localhost.
 */
function getAppBaseUrl(): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const first = domains.split(",")[0]!.trim();
    return `https://${first}`;
  }
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    return `https://${devDomain}`;
  }
  return "http://localhost:5000";
}

/**
 * Returns the full OAuth callback URL that Google should redirect to.
 */
function getCallbackURL(): string {
  return `${getAppBaseUrl()}${CALLBACK_PATH}`;
}

/**
 * Builds the callback URL for the incoming request's actual host, so the same
 * server works in dev, staging, and production without reconfiguring OAuth.
 */
function getRequestCallbackURL(req: Request): string {
  const protocol = req.protocol;
  const host = (req.headers["x-forwarded-host"] as string | undefined)
    ?.split(",")[0]
    ?.trim() ?? req.headers.host ?? "localhost";
  return `${protocol}://${host}${CALLBACK_PATH}`;
}

// ---------------------------------------------------------------------------
// Trusted-host guard
// ---------------------------------------------------------------------------

const trustedHosts = new Set([
  "localhost",
  "localhost:5000",
  "ae3f4c24-07f1-45ff-bcc4-f6f111237c96-00-xhao3bv8l86f.picard.replit.dev",
]);

function isTrustedHost(req: Request): boolean {
  const host = (req.headers["x-forwarded-host"] as string | undefined)
    ?.split(",")[0]
    ?.trim() ?? req.headers.host ?? "";
  const bare = host.split(":")[0]!;

  if (trustedHosts.has(host) || trustedHosts.has(bare)) return true;

  // Accept any .replit.app or .replit.dev production domain
  if (bare.endsWith(".replit.app") || bare.endsWith(".replit.dev")) return true;

  // Accept the domains listed in REPLIT_DOMAINS at runtime
  const runtimeDomains = (process.env.REPLIT_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  if (runtimeDomains.includes(host) || runtimeDomains.includes(bare))
    return true;

  return false;
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
}

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (req.user?.email !== ADMIN_EMAIL) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// Passport setup
// ---------------------------------------------------------------------------

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});

const clientID = process.env.GOOGLE_LOGIN_CLIENT_ID ?? "";
const clientSecret = process.env.GOOGLE_LOGIN_CLIENT_SECRET ?? "";

if (!clientID || !clientSecret) {
  console.warn(
    "[auth] GOOGLE_LOGIN_CLIENT_ID or GOOGLE_LOGIN_CLIENT_SECRET not set — " +
      "Google OAuth will be unavailable until both secrets are configured.",
  );
}

if (clientID && clientSecret) {
  passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: getCallbackURL(),
      passReqToCallback: true,
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value ?? null;
        const displayName = profile.displayName ?? null;

        let user = await storage.getUserByGoogleId(googleId);

        if (!user) {
          if (email) {
            const existing = await storage.getUserByEmail(email);
            if (existing) {
              user = await storage.updateUserGoogle(existing.id, {
                googleId,
                displayName,
              });
            }
          }
        }

        if (!user) {
          const username =
            email?.split("@")[0] ??
            profile.displayName?.replace(/\s+/g, "_").toLowerCase() ??
            `user_${Date.now()}`;
          user = await storage.createUserWithGoogle({
            username,
            googleId,
            email,
            displayName,
          });
        }

        await storage.recordVisit(user.id, user.email);

        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);
} // end if (clientID && clientSecret)

// ---------------------------------------------------------------------------
// setupAuth — call once in app.ts before mounting route handlers
// ---------------------------------------------------------------------------

export function setupAuth(app: Express): void {
  app.set("trust proxy", 1);

  const sessionSecret = process.env.SESSION_SECRET;
  if (isProduction && !sessionSecret) {
    throw new Error("SESSION_SECRET must be set in production");
  }

  app.use(
    session({
      store: new PgSession({
        pool: sessionPool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: sessionSecret ?? "basic-revenue-mgmt-dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction || !!process.env.REPLIT_DEV_DOMAIN,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "lax",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // ---------------------------------------------------------------------------
  // Auth routes
  // ---------------------------------------------------------------------------

  function loginHandler(req: Request, res: Response, next: NextFunction): void {
    if (!clientID || !clientSecret) {
      res.status(503).json({
        error:
          "Google OAuth is not configured. Set GOOGLE_LOGIN_CLIENT_ID and GOOGLE_LOGIN_CLIENT_SECRET.",
      });
      return;
    }
    if (!isTrustedHost(req)) {
      console.warn("[auth] Login attempt from untrusted host:", req.headers.host);
      res.status(403).json({ error: "Untrusted host" });
      return;
    }
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: getRequestCallbackURL(req),
    } as Parameters<typeof passport.authenticate>[1])(req, res, next);
  }

  const callbackHandler = [
    (req: Request, res: Response, next: NextFunction): void => {
      passport.authenticate("google", {
        failureRedirect: "/?error=auth_failed",
        callbackURL: getRequestCallbackURL(req),
      } as Parameters<typeof passport.authenticate>[1])(req, res, next);
    },
    (req: Request, res: Response): void => {
      const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");
      res.redirect(`${basePath}/dashboard`);
    },
  ];

  // Primary login entry point (proxied through /api)
  app.get("/api/auth/google", loginHandler);

  // Primary callback (registered in Google Cloud Console)
  app.get(CALLBACK_PATH, ...callbackHandler);

  // Current-user endpoint
  app.get("/api/auth/user", (req: Request, res: Response): void => {
    if (req.isAuthenticated() && req.user) {
      res.json({
        authenticated: true,
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          displayName: req.user.displayName,
          isAdmin: req.user.email === ADMIN_EMAIL,
        },
      });
    } else {
      res.json({ authenticated: false, user: null });
    }
  });

  // Alias used by some clients
  app.get("/api/auth/me", (req: Request, res: Response): void => {
    if (req.isAuthenticated() && req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response): void => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  });
}
