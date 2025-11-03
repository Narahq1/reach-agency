import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getAllContacts, 
  getContactById, 
  getAllBudgets, 
  getBudgetsByClientId,
  getClientsByUserId,
  getClientById,
  getMessagesByClientId,
  getReportsByClientId,
  getAllPortfolioItems,
  getFeaturedPortfolioItems,
  getAllServices,
  getServiceBySlug
} from "./db";
import { getDb } from "./db";
import { contacts, budgets, clients, messages, reports } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public procedures - Available to all users
  public: router({
    // Get all services
    getServices: publicProcedure.query(async () => {
      return await getAllServices();
    }),

    // Get service by slug
    getServiceBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getServiceBySlug(input.slug);
      }),

    // Get featured portfolio items
    getPortfolio: publicProcedure
      .input(z.object({ featured: z.boolean().optional(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        if (input.featured) {
          return await getFeaturedPortfolioItems(input.limit || 3);
        }
        return await getAllPortfolioItems();
      }),

    // Submit contact form
    submitContact: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        await db.insert(contacts).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          message: input.message,
        });

        return { success: true };
      }),

    // Submit budget request
    submitBudget: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        services: z.array(z.string()),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        await db.insert(budgets).values({
          name: input.name,
          email: input.email,
          company: input.company,
          services: input.services,
          budget: input.budget,
          timeline: input.timeline,
          description: input.description,
        });

        return { success: true };
      }),
  }),

  // Protected procedures - Only for authenticated users
  clientData: router({
    // Get client's own data
    getMyClients: protectedProcedure.query(async ({ ctx }) => {
      return await getClientsByUserId(ctx.user.id);
    }),

    // Get specific client
    getClient: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const client = await getClientById(input.id);
        if (!client || client.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return client;
      }),

    // Create new client
    createClient: protectedProcedure
      .input(z.object({
        companyName: z.string().min(1),
        industry: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        await db.insert(clients).values({
          userId: ctx.user.id,
          companyName: input.companyName,
          industry: input.industry,
          website: input.website,
          phone: input.phone,
          address: input.address,
          description: input.description,
        });

        return { success: true };
      }),
  }),

  // Messages and communication (client-specific)
  clientMessages: router({
    // Get messages for a client
    getMessages: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input, ctx }) => {
        const client = await getClientById(input.clientId);
        if (!client || client.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await getMessagesByClientId(input.clientId);
      }),

    // Send a message
    sendMessage: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        subject: z.string().optional(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        const client = await getClientById(input.clientId);
        if (!client || client.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        await db.insert(messages).values({
          clientId: input.clientId,
          senderId: ctx.user.id,
          senderType: 'client',
          subject: input.subject,
          content: input.content,
        });

        return { success: true };
      }),
  }),

  // Reports and analytics (client-specific)
  clientReports: router({
    // Get reports for a client
    getReports: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input, ctx }) => {
        const client = await getClientById(input.clientId);
        if (!client || client.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await getReportsByClientId(input.clientId);
      }),
  }),

  // Admin procedures
  admin: router({
    // Get all contacts (admin only)
    getAllContacts: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAllContacts();
      }),

    // Get all budgets (admin only)
    getAllBudgets: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAllBudgets();
      }),

    // Update contact status
    updateContactStatus: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return next({ ctx });
      })
      .input(z.object({
        id: z.number(),
        status: z.enum(['new', 'read', 'responded']),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        await db.update(contacts)
          .set({ status: input.status })
          .where(eq(contacts.id, input.id));

        return { success: true };
      }),

    // Update budget status
    updateBudgetStatus: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return next({ ctx });
      })
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'quoted', 'accepted', 'rejected']),
        quotedPrice: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

        await db.update(budgets)
          .set({ 
            status: input.status,
            quotedPrice: input.quotedPrice ? String(input.quotedPrice) : undefined,
            quotedAt: new Date(),
          })
          .where(eq(budgets.id, input.id));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Import eq at the top
import { eq } from "drizzle-orm";
